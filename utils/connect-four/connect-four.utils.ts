import Column from '../../models/Column';
import Disc from '../../models/Disc';
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

function isDiagonalWin(columns: Column[], maxNumberOfRows: number) {
  let x: number = null;
  let y: number = null;
  let xtemp: number = null;
  let ytemp: number = null;
  let currentValue: Disc = null;
  let previousValue: Disc = undefined;
  let tally: number = 0;

  // Test for down-right diagonals across the top.
  for (x = 0; x < columns.length; x++) {
    xtemp = x;
    ytemp = 0;

    while (xtemp < columns.length && ytemp <= maxNumberOfRows) {
      currentValue = columns[xtemp].discs[ytemp];
      if (currentValue !== undefined && previousValue !== undefined && currentValue.user === previousValue.user) {
        tally++;
      } else {
        // Reset the tally if you find a gap.
        tally = 0;
      }
      if (tally === 3) {
        return true;
      }
      previousValue = currentValue;

      // Shift down-right one diagonal index.
      xtemp++;
      ytemp++;
    }
    // Reset the tally and previous value when changing diagonals.
    tally = 0;
    previousValue = undefined;
  }

  // Test for down-left diagonals across the top.
  for (x = 0; x < columns.length; x++) {
    xtemp = x;
    ytemp = 0;

    while (0 <= xtemp && ytemp <= maxNumberOfRows) {
      currentValue = columns[xtemp].discs[ytemp];
      if (currentValue !== undefined && previousValue !== undefined && currentValue.user === previousValue.user) {
        tally++;
      } else {
        // Reset the tally if you find a gap.
        tally = 0;
      }
      if (tally === 3) {
        return true;
      }
      previousValue = currentValue;

      // Shift down-left one diagonal index.
      xtemp--;
      ytemp++;
    }
    // Reset the tally and previous value when changing diagonals.
    tally = 0;
    previousValue = undefined;
  }

  // Test for down-right diagonals down the left side.
  for (y = 0; y <= maxNumberOfRows; y++) {
    xtemp = 0;
    ytemp = y;

    while (xtemp < columns.length && ytemp <= maxNumberOfRows) {
      currentValue = columns[xtemp].discs[ytemp];
      if (currentValue !== undefined && previousValue !== undefined && currentValue.user === previousValue.user) {
        tally++;
      } else {
        // Reset the tally if you find a gap.
        tally = 0;
      }
      if (tally === 3) {
        return true;
      }
      previousValue = currentValue;

      // Shift down-right one diagonal index.
      xtemp++;
      ytemp++;
    }
    // Reset the tally and previous value when changing diagonals.
    tally = 0;
    previousValue = undefined;
  }

  // Test for down-left diagonals down the right side.
  for (y = 0; y <= maxNumberOfRows; y++) {
    xtemp = columns.length - 1;
    ytemp = y;

    while (0 <= xtemp && ytemp <= maxNumberOfRows) {
      currentValue = columns[xtemp].discs[ytemp];
      if (currentValue !== undefined && previousValue !== undefined && currentValue.user === previousValue.user) {
        tally++;
      } else {
        // Reset the tally if you find a gap.
        tally = 0;
      }
      if (tally === 3) {
        return true;
      }
      previousValue = currentValue;

      // Shift down-left one diagonal index.
      xtemp--;
      ytemp++;
    }
    // Reset the tally and previous value when changing diagonals.
    tally = 0;
    previousValue = undefined;
  }

  // No diagonal wins found. Return false.
  return false;
}

export function isWinningPosition(columns: Column[], maxNumberOfRows: number): boolean {
  for (const column of columns) {
    if (columnHasWinningPosition(column)) {
      return true;
    }
  }

  for (let i = 0; i < maxNumberOfRows; i++) {
    if (rowHasWinningPosition(i, columns)) {
      return true;
    }
  }

  return isDiagonalWin(columns, maxNumberOfRows);
}

