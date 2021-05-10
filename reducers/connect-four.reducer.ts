import Column from "../models/Column";
import Disc from "../models/Disc";
import { initColumns } from "../utils/connect-four/connect-four.utils";

export enum ActionEnum {
  ADD_DISC,
  RESET,
}

type Action = {
  type: ActionEnum;
  payload?: {
    index?: number;
    disc?: Disc;
    numberOfColumns?: number;
  };
};

export default function connectFourReducer(
  state: Column[],
  { type, payload }: Action,
) {
  switch (type) {
    case ActionEnum.ADD_DISC:
      return state.map((column, index) => {
        if (index === payload.index) {
          return {
            ...column,
            discs: [...column.discs, payload.disc],
          };
        }

        return column;
      });
    case ActionEnum.RESET:
      return initColumns(payload.numberOfColumns);
  }

  throw new Error(`Unsupported action '${type}'`);
}
