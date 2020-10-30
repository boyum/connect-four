import Column from '../../models/Column';
import UserEnum from '../../models/UserEnum';

export function initColumns(numberOfColumns: number): Column[] {
  return Array(numberOfColumns)
    .fill(undefined)
    .map(() => ({
      discs: []
    }));
}

export function columnHasWinningPosition(column: Column): boolean {
  let discsInARow = 1;
  let previousUser: UserEnum;

  for (const disc of column.discs) {
    if (previousUser === disc.user) {
      discsInARow++;
    } else {
      discsInARow = 1;
    }

    previousUser = disc.user;

    const isWinningPosition = discsInARow === 4;
    if (isWinningPosition) {
      return true;
    }
  }

  return false;
}

export function rowHasWinningPosition(rowIndex: number, columns: Column[]): boolean {
  let discsInARow = 1;
  let previousUser: UserEnum;

  for (const column of columns) {
    const disc = column.discs[rowIndex];

    if (disc && previousUser === disc.user) {
      discsInARow++;
    } else {
      discsInARow = 1;
    }

    previousUser = disc?.user;

    const isWinningPosition = discsInARow === 4;
    if (isWinningPosition) {
      return true;
    }
  }

  return false;
}



export function isWinningPosition(columns: Column[]): boolean {
  for (const column of columns) {
    if (columnHasWinningPosition(column)) {
      return true;
    }
  }

  for (let i = 0; i < columns.length; i++) {
    if (rowHasWinningPosition(i, columns)) {
      return true;
    }
  }

  return false;
}

