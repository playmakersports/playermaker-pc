import { playingStyle as style } from '@/pages/admin/playing/playing.css.ts';
import { type GameEvent } from '@/store/game-events-atom.ts';
import { useEffect, useRef } from 'react';

type Props = {
  maxScore: number;
  scores: (GameEvent & { playerNo: number })[];
};

function RunningScoreTable(props: Props) {
  const { maxScore, scores } = props;
  const tableRef = useRef<HTMLUListElement>(null);
  const renderMaxScore = Math.max(20, maxScore + 4);

  const homePlayersByScore: { [score: number]: number } = {};
  const awayPlayersByScore: { [score: number]: number } = {};

  let homeRunningScore = 0;
  let awayRunningScore = 0;

  scores.forEach(event => {
    const points = Number(event.actionType);
    if (points && !isNaN(points)) {
      if (event.teamType === 'home') {
        homeRunningScore += points;
        homePlayersByScore[homeRunningScore] = event.playerNo;
      } else if (event.teamType === 'away') {
        awayRunningScore += points;
        awayPlayersByScore[awayRunningScore] = event.playerNo;
      }
    }
  });

  useEffect(() => {
    if (maxScore > 16) {
      tableRef.current?.scrollTo({
        top: 35 * homeRunningScore,
        behavior: 'smooth',
      });
    }
  }, [homeRunningScore]);
  useEffect(() => {
    if (maxScore > 16) {
      tableRef.current?.scrollTo({
        top: 35 * awayRunningScore,
        behavior: 'smooth',
      });
    }
  }, [awayRunningScore]);

  return (
    <ul className={style.playingScoreTable} ref={tableRef}>
      <li className={style.scoreTableHeader}>
        <span>HOME</span>
        <span>AWAY</span>
      </li>
      {Array.from({ length: renderMaxScore }).map((_, index) => {
        const currentScore = index + 1;
        const homePlayer = homePlayersByScore[currentScore];
        const awayPlayer = awayPlayersByScore[currentScore];

        return (
          <li key={index} className={style.scoreTableCell}>
            <span>{homePlayer}</span>
            <span className={style.scoreTablePointCell}>{currentScore}</span>
            <span className={style.scoreTablePointCell}>{currentScore}</span>
            <span>{awayPlayer}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default RunningScoreTable;
