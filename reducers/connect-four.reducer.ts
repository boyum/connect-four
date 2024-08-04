import type Column from "../models/Column";
import type Disc from "../models/Disc";
import { initColumns } from "../utils/connect-four/connect-four.utils";

export enum ActionEnum {
  ADD_DISC = 0,
  RESET = 1,
}

type Action =
  | {
      type: ActionEnum.ADD_DISC;
      payload: {
        index: number;
        disc: Disc;
      };
    }
  | {
      type: ActionEnum.RESET;
      payload: {
        numberOfColumns: number;
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
}
