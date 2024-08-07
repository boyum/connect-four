import React, { useEffect, useReducer, useState } from "react";
import type ApiRequest from "../../models/ApiRequest";
import type ApiResponse from "../../models/ApiResponse";
import type DiscModel from "../../models/Disc";
import UserEnum from "../../models/UserEnum";
import connectFourReducer, {
  ActionEnum,
} from "../../reducers/connect-four.reducer";
import {
  initColumns,
  isWinningPosition,
} from "../../utils/connect-four/connect-four.utils";
import Board from "../board";
import styles from "./connect-four.module.scss";

interface ComponentProps {
  maxColumnHeight?: number;
  numberOfColumns?: number;
}

export default function ConnectFour({
  numberOfColumns = 8,
  maxColumnHeight = 8,
}: ComponentProps) {
  const [columns, dispatch] = useReducer(
    connectFourReducer,
    initColumns(numberOfColumns),
  );
  const [activeUser, setActiveUser] = useState(UserEnum.Player1);
  const [winner, setWinner] = useState<UserEnum|null>(null);
  const [mode, setMode] = useState(1);
  const [difficulty, setDifficulty] = useState(2);
  const [connectFourClass, setConnectFourClass] = useState(styles.connectFour);

  const onColumnClick = (columnIndex: number) => {
    const columnCanFitMoreDiscs =
      columns[columnIndex].discs.length < maxColumnHeight;

    if (!columnCanFitMoreDiscs) {
      return;
    }

    const onePlayerMode = mode === 1;
    const computerIsActiveUser = activeUser === UserEnum.Player2;
    if (onePlayerMode && computerIsActiveUser) {
      return;
    }

    dispatch({
      type: ActionEnum.ADD_DISC,
      payload: {
        index: columnIndex,
        disc: {
          user: activeUser,
        } as DiscModel,
      },
    });
  };

  const reset = () => {
    setWinner(null);
    setActiveUser(UserEnum.Player1);
    setConnectFourClass(`${styles.connectFour}`);
    dispatch({ type: ActionEnum.RESET, payload: { numberOfColumns } });
  };

  const toggleMode = () => {
    setMode(3 - mode);
    reset();
  };

  useEffect(() => {
    const gameHasStarted = columns.flatMap(column => column.discs).length > 0;
    if (gameHasStarted) {
      if (isWinningPosition(columns, maxColumnHeight)) {
        setWinner(activeUser);
      } else {
        setActiveUser(
          activeUser === UserEnum.Player1 ? UserEnum.Player2 : UserEnum.Player1,
        );
      }
    }
  }, [columns, activeUser, maxColumnHeight]);

  useEffect(() => {
    const onePlayerMode = mode === 1;
    const computerIsActiveUser = activeUser === UserEnum.Player2;
    if (onePlayerMode && computerIsActiveUser) {
      const fetchNextMove = async () => {
        try {
          const body: ApiRequest = {
            columns,
            difficulty,
          };

          const nextMove = await fetch("/api/next-move", {
            body: JSON.stringify(body),
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const response: ApiResponse = await nextMove.json();

          console.info(
            `Process time: ${(response.processDuration / 10e8).toFixed(
              2,
            )} seconds`,
          );

          dispatch({
            type: ActionEnum.ADD_DISC,
            payload: {
              index: response.move.move,
              disc: {
                user: activeUser,
              } as DiscModel,
            },
          });
        } catch (error) {
          console.error(error);
        }
      };

      fetchNextMove();
    }
  }, [activeUser, columns, difficulty, mode]);

  useEffect(() => {
    const hasWinner = winner !== null;
    if (hasWinner) {
      setConnectFourClass(
        `${styles.connectFour} ${styles.connectFourGameOver}`,
      );
    }
  }, [winner]);

  const getGameOverText = () => {
    let gameOverText = "";

    const isSinglePlayer = mode === 1;
    const playerOneWon = (winner as UserEnum) === UserEnum.Player1;
    if (isSinglePlayer) {
      gameOverText = playerOneWon
        ? "✨ Congratulations! You won! ✨"
        : "The computer won. Better luck next time! 🖥";
    } else {
      gameOverText = playerOneWon
        ? "Green player won! 🌱"
        : "Pink player won! 🌸";
    }

    return gameOverText;
  };

  return (
    <div className={connectFourClass}>
      <div className={styles.buttons}>
        <button
          type="button"
          className={styles.modeToggle}
          onClick={toggleMode}
          data-mode={mode}
        >
          <span className={styles.onePlayer}>One player</span>
          <span className={styles.twoPlayers}>Two players</span>
        </button>
        <button type="button" className={styles.resetButton} onClick={reset}>
          Reset
        </button>
      </div>
      <div className={styles.board}>
        <Board
          columns={columns}
          maxColumnHeight={maxColumnHeight}
          onColumnClick={onColumnClick}
        />
      </div>
      <div className={styles.gameOver}>
        {getGameOverText()}
        <br />
        <button
          type="button"
          className={styles.playAgainButton}
          onClick={reset}
        >
          Play again
        </button>
      </div>
    </div>
  );
}
