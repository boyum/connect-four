import React from 'react';
import ColumnModel from '../../models/Column';
import Disc from '../disc';
import styles from './column.module.scss';

interface ComponentProps {
  column: ColumnModel;
  onClick: (event: React.MouseEvent) => void;
}

export default function Column({ column, onClick }: ComponentProps) {

  return (
    <button className={styles.column} onClick={onClick}>
      {column.discs.map((disc, index) => <Disc key={`disc-${index}`} disc={disc} />)}
    </button>
  );
}
