import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { PesahEntity } from '../pesah.model';
import { clearPesahAction, putPesahInStateActions } from './pesah.actions';

export const pesahReducerToken = 'pesah-reducer';

export type PesahState = EntityState<PesahEntity>;

const pesahAdapter = createEntityAdapter<PesahEntity>();

export const pesahAdapterInitialState = pesahAdapter.getInitialState();

export const pesahReducer = createReducer(
  pesahAdapterInitialState,
  on(putPesahInStateActions, upsertPesahActionHandler),
  on(clearPesahAction, clearPesahActionHandler),
);

function upsertPesahActionHandler(
  state: PesahState,
  { pesah }: { pesah: PesahEntity[] }
): PesahState {
  return pesahAdapter.upsertMany(pesah, state);
}

function clearPesahActionHandler(state: PesahState): PesahState {
  return pesahAdapter.removeAll(state);
}

export const selectPesahState =
  createFeatureSelector<PesahState>(pesahReducerToken);

export const { selectAll: selectAllPesah } =
  pesahAdapter.getSelectors(selectPesahState);
