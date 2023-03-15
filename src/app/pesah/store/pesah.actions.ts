import { createAction, props } from '@ngrx/store';
import { PesahEntity } from '../pesah.model';

export enum PesahActions {
  ADD_PESAH = '[Pesah] add pesah',
  PUT_PESAH_IN_STATE = '[Pesah] put pesah in state',
  UPDATE_SOME_PESAH = '[Pesah] update some pesah',
  LISTEN_TO_PESAH_UPDATES = '[Pesah] listen to pesah updates',
  STOP_LISTEN_TO_PESAH_UPDATES = '[Pesah] stop listen to pesah updates',
  CLEAR_PESAH = '[Pesah] clear pesah',
}

export const upsertPesahAction = createAction(
  PesahActions.ADD_PESAH,
  props<{ amount?: number }>()
);

export const putPesahInStateActions = createAction(
  PesahActions.PUT_PESAH_IN_STATE,
  props<{ pesah: PesahEntity[] }>()
);

export const updateSomePesahAction = createAction(
  PesahActions.UPDATE_SOME_PESAH
);

export const listenToPesahUpdatesAction = createAction(
  PesahActions.LISTEN_TO_PESAH_UPDATES
);

export const stopListenToPesahUpdatesAction = createAction(
  PesahActions.STOP_LISTEN_TO_PESAH_UPDATES
);

export const clearPesahAction = createAction(PesahActions.CLEAR_PESAH);
