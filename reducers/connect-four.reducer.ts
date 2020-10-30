import Column from '../models/Column';

export enum ActionEnum {
  ADD_DISC
}

type Action = {
  type: ActionEnum;
  payload: any;
};

export default function connectFourReducer(state: Column[], action: Action) {
  switch (action.type) {
    case ActionEnum.ADD_DISC:
      return state.map((column, index) => {
        if (index === action.payload.index) {
          return {
            ...column,
            discs: [...column.discs, action.payload.disc],
          };
        }

        return column;
      });
  }
}