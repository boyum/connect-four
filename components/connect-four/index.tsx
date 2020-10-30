import React, { useEffect, useReducer, useState } from 'react';
import UserEnum from '../../models/UserEnum';
import DiscModel from '../../models/Disc';
import connectFourReducer, { ActionEnum } from '../../reducers/connect-four.reducer';
import { initColumns, isWinningPosition } from '../../utils/connect-four/connect-four.utils';
import Board from '../board';
import styles from './connect-four.module.scss';

interface ComponentProps {
  maxColumnHeight?: number;
  numberOfColumns?: number;
  numberOfPlayers?: number;
}

export default function ConnectFour({ numberOfPlayers = 2, numberOfColumns = 8, maxColumnHeight = 8 }: ComponentProps) {
  const [columns, dispatch] = useReducer(connectFourReducer, initColumns(numberOfColumns));
  const [activeUser, setActiveUser] = useState(UserEnum.Player1);
  const [winner, setWinner] = useState<UserEnum>(null);

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
      }
    });
  };

  const reset = () => {
    setWinner(null);
    setActiveUser(UserEnum.Player1);
    dispatch({ type: ActionEnum.RESET, payload: { numberOfColumns } });
  }

  useEffect(() => {
    const gameHasStarted = columns.flatMap(column => column.discs).length > 0;
    if (gameHasStarted) {
      if (isWinningPosition(columns, maxColumnHeight)) {
        console.log('is winning position')
        setWinner(activeUser);
      } else {
        setActiveUser(activeUser === UserEnum.Player1 ? UserEnum.Player2 : UserEnum.Player1);
      }
    }

  }, [columns])

  useEffect(() => {
    const hasWinner = winner !== null;
    if (hasWinner) {
      alert(`${(winner as UserEnum) === UserEnum.Player1 ? 'Green' : 'Pink'} player won`);

      reset();
    }

  }, [winner]);

  return (
    <div className={styles.connectFour}>
      <Board columns={columns} onColumnClick={onColumnClick} />
    </div>
  )
}