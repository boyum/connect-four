import React, { useEffect, useState } from "react";
import ColumnModel from "../../models/Column";
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
    <button className={styles.column} onClick={onClick} disabled={disabled}>
      {column.discs.map((disc, index) => (
        <Disc key={`disc-${index}`} disc={disc} />
      ))}
    </button>
  );
}
