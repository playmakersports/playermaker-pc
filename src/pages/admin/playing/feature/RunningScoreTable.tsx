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
    <ul
      className="relative h-[75vh] border border-gray-300 rounded-lg overflow-auto"
      style={{ width: 'var(--center-width)' }}
      ref={tableRef}
    >
      <li className="text-base font-semibold sticky top-0 py-1.5 flex justify-around bg-gray-100 border-b border-gray-300 text-center">
        <span>HOME</span>
        <span>AWAY</span>
      </li>
      {Array.from({ length: renderMaxScore }).map((_, index) => {
        const currentScore = index + 1;
        const homePlayer = homePlayersByScore[currentScore];
        const awayPlayer = awayPlayersByScore[currentScore];

        return (
          <li key={index} className="text-lg font-normal border-b border-gray-200 text-center min-h-9 grid grid-cols-[1fr_auto_auto_1fr] items-center">
            <span>{homePlayer}</span>
            <span className="score-table-point-cell text-base font-semibold py-1.5 min-w-10 bg-gray-50 text-gray-600 border-l border-gray-200 [font-feature-settings:'cv02','cv04','cv06','cv09','cv13']">
              {currentScore}
            </span>
            <span className="score-table-point-cell text-base font-semibold py-1.5 min-w-10 bg-gray-50 text-gray-600 border-l border-gray-200 [font-feature-settings:'cv02','cv04','cv06','cv09','cv13']">
              {currentScore}
            </span>
            <span>{awayPlayer}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default RunningScoreTable;
