import type { CSSProperties } from "react";
import React from "react";
import type DiscModel from "../../models/Disc";
import UserEnum from "../../models/UserEnum";
import styles from "./disc.module.scss";

interface ComponentProps {
  disc: DiscModel;
}

export default function Disc({ disc }: ComponentProps) {
  const color = disc.user === UserEnum.Player1 ? "--color-1" : "--color-2";

  const css: CSSProperties = {
    // @ts-expect-error Custom properties are allowed
    "--disc-color": `var(${color})`,
  };

  return <div className={styles.disc} style={css} />;
}
