import React from 'react';
import UserEnum from '../../models/UserEnum';
import DiscModel from '../../models/Disc';
import styles from './disc.module.scss';

interface ComponentProps {
  disc: DiscModel;
}

export default function Disc({ disc }: ComponentProps) {
  const color = disc.user === UserEnum.Player1 ? '--color-1' : '--color-2';

  const css: any = {
    '--disc-color': `var(${color})`,
  };

  return (
    <div className={styles.disc} style={css}>

    </div>
  );
}
