import type React from "react";
import { useEffect, useState } from "react";
import type ColumnModel from "../../models/Column";
import Disc from "../disc";
import styles from "./column.module.scss";

interface ComponentProps {
  column: ColumnModel;
  maxColumnHeight: number;
  onClick: (event: React.MouseEvent) => void;
}

export default function Column({
  column,
  onClick,
  maxColumnHeight,
}: ComponentProps) {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(column.discs.length >= maxColumnHeight);
  }, [column, maxColumnHeight]);

  return (
    <button
      className={styles.column}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {column.discs.map(disc => (
        // biome-ignore lint/correctness/useJsxKeyInIterable: The only key we have is the disc's index
        <Disc disc={disc} />
      ))}
    </button>
  );
}
