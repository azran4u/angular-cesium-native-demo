import {Injectable} from '@angular/core';
import * as Cesium from 'cesium';
import {DrawableEntity, MAP_LAYERS} from '../models/map.model';
import {MapService} from '../services/map.service';
import {take} from 'rxjs';
import {ICesiumBillboardOptions, ICesiumLabelOptions, ICesiumPointPrimitiveOptions} from '../models/cesium-interfaces';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseMapLayerControllerService<T extends DrawableEntity> {
  /** magic number to understand what is a small bunch of elements to draw/redraw so we wont have to
   * destroy the whole collection and draw everything again to avoid the blip
   */
  smallAmountOfUpdatedEntities = 20;

  /**
   * actually i dont really know what i do with this array but i wanted to keep the same behavior for entities
   * and primitives.
   * @protected
   */
  protected entities: Cesium.Entity[] = [];
  private readonly layer: MAP_LAYERS = MAP_LAYERS.DEFAULT;

  /**
   *  we need the primitives object so we could manually remove them from the viewer.scene.primitives collection
   *  we need the reference itself to remove them, and not just ID. also they dont have ID so handling their
   *  reference is very important
   * @protected
   */
  protected primitives: {
    billboardsCollection: Cesium.BillboardCollection | undefined;
    pointsCollection: Cesium.PointPrimitiveCollection | undefined;
    labelsCollection: Cesium.LabelCollection | undefined;
  }
  /**
   * Elements Record is for handling the primitives on our side, so we would have a reference to them,
   * so we could remove them from the collection manually and not just destroying the whole collection.
   * @private
   */
  private elementsRecord: Map<string, { billboards: Cesium.Billboard[]; points: Cesium.PointPrimitive[]; labels: Cesium.Label[] }> = new Map<string, { billboards: Cesium.Billboard[]; points: Cesium.PointPrimitive[]; labels: Cesium.Label[] }>();

  protected constructor(private mapService: MapService, layer: MAP_LAYERS = MAP_LAYERS.DEFAULT) {
    this.layer = layer;
    /**
     * we need to wait for the viewer to be ready, so we could create our layer.
     */
    this.mapService.viewerReady$.pipe(take(1)).subscribe(() => {
      this.createLayer().then();
    })
    this.primitives = {
      billboardsCollection: new Cesium.BillboardCollection(),
      pointsCollection: new Cesium.PointPrimitiveCollection(),
      labelsCollection: new Cesium.LabelCollection(),
    }
  }

  get layerType(): MAP_LAYERS {
    return this.layer
  }

  async createLayer(): Promise<void> {
    await this.mapService.createLayer(this.layer);
  }

  /**
   * this function draws the whole layer from scratch. meaning it's getting the current elements to draw
   * and removing every object from previous cycle of drawing.
   * what you pass in the elements is what is gonna be drawn FOR THIS LAYER ALONE.
   * @param elements: the current state of the layer to draw.
   */
  drawElementsOnMapAndDeletePreviousDrawnObjects(elements: T[]): void {
    this.removePreviousEntitiesAndPrimitives();
    const billboardsCollection = new Cesium.BillboardCollection();
    const labelsCollection = new Cesium.LabelCollection();
    const pointsCollection = new Cesium.PointPrimitiveCollection();
    const entities: Cesium.Entity[] = [];
    this.createPrimitivesAndEntitiesFromElements(elements, entities, {
      billboardsCollection,
      labelsCollection,
      pointsCollection
    })
    this.primitives = {
      billboardsCollection,
      pointsCollection,
      labelsCollection
    };
    this.entities = entities ?? [];
    this.mapService.upsertPrimitives({
      billboards: billboardsCollection,
      points: pointsCollection,
      labels: labelsCollection
    });
    this.mapService.addEntities(this.layerType, entities ?? []);
  }

// TODO: i have a problem when it is automatically updating and i try to add more elements to the array
  /**
   * Unlike the function {@link drawElementsOnMapAndDeletePreviousDrawnObjects}
   * this function is drawing on top of what already exists in this layer. meaning it is getting
   * arrays of added, updated and deleted and handling them without clearing the previously drawn object.
   * @param added: the elements that were added from the previous drawn cycle
   * @param updated: the elements to update on the map (deleting the previous instances and adding them again)
   * @param deletedIds: deleting the related instances from the map by their ids.
   */
  upsertAndDeleteElementsOnMap(added: T[], updated: T[], deletedIds: string[]): void {
    // ADD
    const billboardsCollection = this.primitives.billboardsCollection ?? new Cesium.BillboardCollection();
    const labelsCollection = this.primitives.labelsCollection ?? new Cesium.LabelCollection();
    const pointsCollection = this.primitives.pointsCollection ?? new Cesium.PointPrimitiveCollection();
    const entities: Cesium.Entity[] = [];
    this.createPrimitivesAndEntitiesFromElements(added, entities, {
      billboardsCollection,
      labelsCollection,
      pointsCollection
    });
    this.primitives = {
      ...this.primitives,
      billboardsCollection,
      pointsCollection,
      labelsCollection
    }
    this.mapService.upsertPrimitives({
      labels: labelsCollection,
      points: pointsCollection,
      billboards: billboardsCollection
    });

    // UPDATE
    const updatedEntities: Cesium.Entity[] = []
    for (const element of updated) {
      const prevCesiumElementsObject = this.elementsRecord.get(element.id);
      if (prevCesiumElementsObject) {
        this.removePrimitivesFromCollections(prevCesiumElementsObject);
      }
      this.createPrimitivesAndEntitiesFromSingleElement(element, billboardsCollection, labelsCollection, pointsCollection, entities)
    }

    this.mapService.upsertEntitiesToLayer(this.layerType, [...(entities ?? []), ...(updatedEntities ?? [])], false)

    // DELETE
    for (const deletedId of deletedIds) {
      const prevCesiumElementsObject = this.elementsRecord.get(deletedId);
      if (prevCesiumElementsObject) {
        this.removePrimitivesFromCollections(prevCesiumElementsObject);
      }
    }
    this.deleteEntitiesFromRecord(deletedIds);
    this.mapService.removeEntitiesOfLayerByIds(this.layerType, deletedIds);
  }

  removeAllEntitiesFromLayer(): void {
    this.mapService.upsertEntitiesToLayer(
      this.layer,
      [],
      true
    );
  }

  hideLayer(): void {
    this.mapService.hideLayer(this.layer);
  }

  showLayer(): void {
    this.mapService.showLayer(this.layer);
  }

  async focusOnEntities(): Promise<void> {
    const entitiesToFocusOn = this.mapService.getEntities(this.layer);
    await this.mapService.flyTo(entitiesToFocusOn);
  }

  async flyToEntity(id: string): Promise<void> {
    await this.mapService.flyTo(this.mapService.getEntityById(id, this.layer) ?? []);
  }

  /**
   * this function would give the list of properties to look inside and element to check if there were changes
   * in how an element should be drawn on the map.
   * this function should be an iteratee instead of and array.
   * @return list - list of properties to check for in an element
   *                return an empty array if you want the diff to only be by reference.
   */
  abstract propertiesToListenWhenChangeHappens(): (keyof T)[];

  /**
   * each service would have the implement this function and would have to return how a single element
   * should look on the map.
   * it doesn't have to have everything of course. add to the array only what you need.
   * @param element
   */
  abstract getCesiumElementForSingleEntity(element: T): {
    billboards?: ICesiumBillboardOptions[];
    points?: ICesiumPointPrimitiveOptions[];
    labels?: ICesiumLabelOptions[];
    entity?: Cesium.Entity;
  }

  private createPrimitivesAndEntitiesFromElements(elements: T[], cesiumEntities: Cesium.Entity[], {
    billboardsCollection,
    labelsCollection,
    pointsCollection
  }: { billboardsCollection: Cesium.BillboardCollection, labelsCollection: Cesium.LabelCollection, pointsCollection: Cesium.PointPrimitiveCollection }): void {
    for (const element of elements) {
      this.createPrimitivesAndEntitiesFromSingleElement(element, billboardsCollection, labelsCollection, pointsCollection, cesiumEntities);
    }
  }

  private createPrimitivesAndEntitiesFromSingleElement(element: T,
                                                       billboardsCollection: Cesium.BillboardCollection,
                                                       labelsCollection: Cesium.LabelCollection,
                                                       pointsCollection: Cesium.PointPrimitiveCollection,
                                                       cesiumEntities: Cesium.Entity[]): void {
    const {billboards, points, labels, entity} = this.getCesiumElementForSingleEntity(element);
    const cesiumBillboards: Cesium.Billboard[] = []
    const cesiumLabels: Cesium.Label[] = []
    const cesiumPoints: Cesium.PointPrimitive[] = []
    billboards?.forEach(billboard => {
      cesiumBillboards.push(billboardsCollection.add(billboard));
    })
    labels?.forEach(label => {
      cesiumLabels.push(labelsCollection.add(label));
    })
    points?.forEach(point => {
      cesiumPoints.push(pointsCollection.add(point));
    })
    if (entity) {
      cesiumEntities.push(entity);
    }
    this.recordEntity(element.id, cesiumBillboards, cesiumPoints, cesiumLabels);
  }

  /**
   * Clearing previous drawn state of this layer
   * @private
   */
  private removePreviousEntitiesAndPrimitives(): void {
    this.removePreviousCollection(this.primitives.billboardsCollection);
    this.removePreviousCollection(this.primitives.pointsCollection);
    this.removePreviousCollection(this.primitives.labelsCollection);
    this.primitives.billboardsCollection = undefined
    this.primitives.pointsCollection = undefined;
    this.primitives.labelsCollection = undefined;
    if (this.entities?.length) {
      this.mapService.removeEntities(this.layerType);
      this.entities = [];
    }
    this.clearEntitiesRecord();
  }

  /**
   * removing manually the primitives from their collection, because they're primitives we cant
   * delete by id, so we have the remove by reference. that's why we are keeping them in an object
   * @param prevCesiumElementsObject
   * @private
   */
  private removePrimitivesFromCollections(prevCesiumElementsObject: { billboards: Cesium.Billboard[]; points: Cesium.PointPrimitive[]; labels: Cesium.Label[] }) {
    prevCesiumElementsObject.labels?.forEach((label) => {
      this.primitives.labelsCollection?.remove(label);
    })
    prevCesiumElementsObject.points?.forEach((label) => {
      this.primitives.pointsCollection?.remove(label);
    })
    prevCesiumElementsObject.billboards?.forEach((billboard) => {
      this.primitives.billboardsCollection?.remove(billboard);
    })
  }

  /**
   * removing a collection from primitives.
   * the action already destroys the collection itself when you remove it from the scene.
   * @param collection
   * @private
   */
  private removePreviousCollection(collection: Cesium.BillboardCollection | Cesium.LabelCollection | Cesium.PointPrimitiveCollection | undefined): boolean {
    if (collection?.length && !collection.isDestroyed()) {
      return !!this.mapService.removeCollection(collection)
    }
    return false
  }

  /**
   * record the primitives by id. so we could remove and update them later on.
   * @param id - the element id
   * @param billboards - their array of billboards
   * @param points - their array of points
   * @param labels - their array of labels
   * @private
   */
  private recordEntity(id: string, billboards: Cesium.Billboard[], points: Cesium.PointPrimitive[], labels: Cesium.Label[]): void {
    this.elementsRecord.set(id, {billboards, labels, points});
  }

  /**
   * removing multiple records of elements by their id from the local state
   * @param ids - the element ids to remove their record
   * @private
   */
  private deleteEntitiesFromRecord(ids: string[]): void {
    ids.forEach(id => {
      this.elementsRecord.delete(id);
    })
  }

  /**
   * clears the record - the local state of the primitives of the current layer.
   * @private
   */
  private clearEntitiesRecord(): void {
    this.elementsRecord.clear();
  }
}
