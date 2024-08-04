import React from "react";
import type ColumnModel from "../../models/Column";
import Column from "../column";
import styles from "./board.module.scss";

interface ComponentProps {
  columns: ColumnModel[];
  onColumnClick: (columnIndex: number) => void;
  maxColumnHeight: number;
}

export default function Board({
  columns,
  onColumnClick,
  maxColumnHeight,
}: ComponentProps) {
  return (
    <div className={styles.board}>
      {columns?.map((column, index) => (
        // biome-ignore lint/correctness/useJsxKeyInIterable: The only index we have is each column's index
        <Column
          column={column}
          maxColumnHeight={maxColumnHeight}
          onClick={onColumnClick.bind(null, index)}
        />
      ))}
    </div>
  );
}
