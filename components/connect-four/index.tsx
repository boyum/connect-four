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
}

export default function ConnectFour({ numberOfColumns = 8, maxColumnHeight = 8 }: ComponentProps) {
  const [columns, dispatch] = useReducer(connectFourReducer, initColumns(numberOfColumns));
  const [activeUser, setActiveUser] = useState(UserEnum.Player1);
  const [winner, setWinner] = useState<UserEnum>(null);
  const [mode, setMode] = useState(1);

  const onColumnClick = (columnIndex: number) => {
    const columnCanFitMoreDiscs = columns[columnIndex].discs.length < maxColumnHeight;

    if (!columnCanFitMoreDiscs) {
      return;
    }

    const onePlayerMode = mode === 1;
    const computerIsActiveUser = activeUser === UserEnum.Player2;
    if (onePlayerMode && computerIsActiveUser) {
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

  const toggleMode = () => {
    setMode(3 - mode);
    reset();
  }

  useEffect(() => {
    const gameHasStarted = columns.flatMap(column => column.discs).length > 0;
    if (gameHasStarted) {
      if (isWinningPosition(columns, maxColumnHeight)) {
        setWinner(activeUser);
      } else {
        setActiveUser(activeUser === UserEnum.Player1 ? UserEnum.Player2 : UserEnum.Player1);
      }
    }

  }, [columns]);

  useEffect(() => {
    const onePlayerMode = mode === 1;
    const computerIsActiveUser = activeUser === UserEnum.Player2;
    if (onePlayerMode && computerIsActiveUser) {
      const fetchNextMove = async () => {
        try {
          const nextMove = await fetch('/api/next-move', {
            body: JSON.stringify(columns),
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const nextColumnIndex = (await nextMove.json()).index;

          dispatch({
            type: ActionEnum.ADD_DISC, payload: {
              index: nextColumnIndex,
              disc: {
                user: activeUser,
              } as DiscModel,
            }
          });
        }

        catch (error) {
          console.error(error);
        }
      }

      fetchNextMove();
    }
  }, [activeUser]);

  useEffect(() => {
    const hasWinner = winner !== null;
    if (hasWinner) {
      alert(`${(winner as UserEnum) === UserEnum.Player1 ? 'Green' : 'Pink'} player won`);

      reset();
    }

  }, [winner]);

  return (
    <div className={styles.connectFour}>
      <div className={styles.buttons}>
        <button type="button" className={styles.modeToggle} onClick={toggleMode} data-mode={mode}>
          <span className={styles.onePlayer}>One player</span>
          <span className={styles.twoPlayers}>Two players</span>
        </button>
        <button type="button" className={styles.resetButton} onClick={reset}>Reset</button>
      </div>
      <Board columns={columns} maxColumnHeight={maxColumnHeight} onColumnClick={onColumnClick} />
    </div>
  )
}