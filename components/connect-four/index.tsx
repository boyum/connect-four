import React, { useEffect, useReducer, useState } from 'react';
import UserEnum from '../../models/UserEnum';
import DiscModel from '../../models/Disc';
import connectFourReducer, { ActionEnum } from '../../reducers/connect-four.reducer';
import { initColumns, isWinningPosition } from '../../utils/connect-four/connect-four.utils';
import Board from '../board';
import styles from './connect-four.module.scss';

interface ComponentProps {
  maxColumnHeight: number;
  numberOfColumns: number;
  numberOfPlayers: number;
}

export default function ConnectFour({ numberOfPlayers = 2, numberOfColumns = 8, maxColumnHeight = 8 }: ComponentProps) {
  const [columns, dispatch] = useReducer(connectFourReducer, initColumns(numberOfColumns));
  const [activeUser, setActiveUser] = useState(UserEnum.Player1);
  const [winner, setWinner] = useState<UserEnum>(undefined);

  const onColumnClick = (columnIndex: number) => {
    const columnCanFitMoreDiscs = columns[columnIndex].discs.length < maxColumnHeight;

    if (!columnCanFitMoreDiscs) {
      return;
    }

    dispatch({
      type: ActionEnum.ADD_DISC, payload: {
        index: columnIndex,
        disc: {
          user: activeUser,
        } as DiscModel,
        maxColumnHeight,
      }
    });
  };

  useEffect(() => {
    if (isWinningPosition(columns)) {
      console.log('is winning position')
      setWinner(activeUser);
    } else {
      setActiveUser(activeUser === UserEnum.Player1 ? UserEnum.Player2 : UserEnum.Player1);
    }

  }, [columns])

  useEffect(() => {
    if (winner) {
      alert(`Player ${winner + 1} won`);
    }

  }, [winner]);

  return (
    <div className={styles.connectFour}>
      <Board columns={columns} onColumnClick={onColumnClick} />
    </div>
  )
}