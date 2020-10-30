import React from 'react';
import ColumnModel from '../../models/Column';
import Column from '../column';
import styles from './board.module.scss';

interface ComponentProps {
  columns: ColumnModel[];
  onColumnClick: (columnIndex: number) => void
}

export default function Board({ columns, onColumnClick }: ComponentProps) {

  return (
    <div className={styles.board}>
      {columns?.map((column, index) => <Column key={`column-${index}`} column={column} onClick={onColumnClick.bind(null, index)} />)}
    </div>
  );
}
