import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useParams } from 'react-router';
import { groupBy, mapValues, sumBy } from 'es-toolkit';

import { fonts } from '@/style/typo.css.ts';
import { playingStyle as style } from '@/pages/admin/playing/playing.css.ts';
import { addEventAtom, gameEventsAtom, pausedEventsAtom, timerAtom } from '@/store/game-events-atom.ts';
import RunningScoreTable from '@/pages/admin/playing/feature/RunningScoreTable.tsx';
import { type PlayingActionType } from '@/enums/playing.ts';
import { useGetMatchInfo } from '@/query/match.ts';
import { flexs } from '@/style/container.css.ts';
import { timestampToTimerMS } from '@/share/libs/format.ts';
import TeamActionController from '@/pages/admin/playing/feature/TeamActionController.tsx';
import { useSetAtom } from 'jotai/index';

function PlayingIdIndex() {
  const { matchId } = useParams<{ matchId: string }>();

  const [gameEvents] = useAtom(gameEventsAtom);
  const setPausedEvents = useSetAtom(pausedEventsAtom);
  const [, addEvent] = useAtom(addEventAtom);
  const [timer, setTimer] = useAtom(timerAtom);
  const [currentTime, setCurrentTime] = useState(0);
  const [quarter, setQuarter] = useState(1);

  const [playing, setPlaying] = useState<{ home: number[]; away: number[] }>({ home: [], away: [] });

  const { data } = useGetMatchInfo(Number(matchId));
  const playerList = data?.playlists.map(player => ({
    playerId: player.player.playerId,
    playerName: player.player.name,
    playerNo: player.player.number,
    teamType: player.homeYn ? 'home' : 'away',
  }));

  useEffect(() => {
    if (data) {
      setPlaying({
        home: data.playlists.filter(p => p.homeYn && p.starter).map(p => p.player.playerId),
        away: data.playlists.filter(p => !p.homeYn && p.starter).map(p => p.player.playerId),
      });
    }
  }, [data]);

  const teamScores = () => {
    return mapValues(
      groupBy(
        gameEvents.filter(event => ['1', '2', '3'].includes(event.actionType)),
        event => event.teamType!,
      ),
      items => sumBy(items, event => Number(event.actionType)),
    );
  };

  const teamFouls = useMemo(() => {
    const { PF: personalFouls } = groupBy(gameEvents, event => event.actionType);
    return groupBy(
      (personalFouls ?? []).filter(f => f.quarter === quarter),
      f => f.teamType!,
    );
  }, [gameEvents]);

  const handleQuarterStart = () => {
    if (timer.pausedTime === 0 && !timer.isRunning) {
      addEvent({
        playerId: null,
        teamType: null,
        actionType: `${quarter}S` as PlayingActionType,
        quarter,
      });
    }
    handleTimerToggle();
  };
  const handleTimerToggle = () => {
    const now = Date.now();

    if (timer.isRunning) {
      // 타이머 일시정지
      const currentElapsed = timer.startTimestamp ? now - timer.startTimestamp : 0;
      setTimer({
        isRunning: false,
        startTimestamp: null,
        pausedTime: timer.pausedTime + currentElapsed,
      });
      setPausedEvents(prev => [
        ...prev,
        {
          timestamp: now,
          type: 'start',
          quarter,
        },
      ]);
    } else {
      // 타이머 시작
      setTimer({
        isRunning: true,
        startTimestamp: now,
        pausedTime: timer.pausedTime,
      });
      setPausedEvents(prev => [
        ...prev,
        {
          timestamp: now,
          type: 'end',
          quarter,
        },
      ]);
    }
  };

  const handleQuarterEnd = () => {
    if (timer.isRunning) {
      handleTimerToggle();
      setTimer({
        isRunning: false,
        startTimestamp: null,
        pausedTime: 0,
      });
      addEvent({
        playerId: null,
        teamType: null,
        actionType: `${quarter}E` as PlayingActionType,
        quarter,
      });
      setQuarter(prev => prev + 1);
    }
  };

  useEffect(() => {
    let intervalId: number;

    if (timer.isRunning && timer.startTimestamp) {
      intervalId = setInterval(() => {
        const now = Date.now();
        const currentElapsed = now - timer.startTimestamp!;
        const totalTime = timer.pausedTime + currentElapsed;
        setCurrentTime(totalTime);
      }, 1000);
    } else if (!timer.isRunning) {
      setCurrentTime(timer.pausedTime);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timer]);

  return (
    <div style={{ display: 'flex' }}>
      <div
        className={fonts.body4.regular}
        style={{
          padding: '10px',
          width: '200px',
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          height: '100vh',
          overflow: 'auto',
        }}
      >
        {JSON.stringify(gameEvents).replaceAll('}', '}\n')}
      </div>
      <section className={style.pageSection} style={{ flex: 1 }}>
        <header className={style.layoutContainer}>
          <div className={style.headerTeam}>
            <p className={flexs({ gap: '4' })}>
              <span className={style.teamTypeFlag}>HOME</span> {data?.recordMatchResponseDto.homeTeam.teamName}
            </p>
            <ul className={style.headerTeamFouls}>
              {[1, 2, 3, 4, 5].map(num => (
                <li key={`home-fouls-${num}`} data-active={teamFouls.home?.length >= num}>
                  {num}
                </li>
              ))}
            </ul>
          </div>
          <div className={style.headerCenter}>
            <div style={{ flex: 1 }}>{teamScores().home}</div>
            <div className={clsx(style.playingScore, { [style.playingTimeout]: !timer.isRunning })}>
              {quarter}Q - <span className="time">{timestampToTimerMS(currentTime)}</span>
            </div>
            <div style={{ flex: 1 }}>{teamScores().away}</div>
          </div>
          <div className={style.headerTeam}>
            <p className={flexs({ gap: '4' })}>
              <span className={style.teamTypeFlag}>AWAY</span> {data?.recordMatchResponseDto.awayTeam.teamName}
            </p>
            <ul className={style.headerTeamFouls}>
              {[1, 2, 3, 4, 5].map(num => (
                <li key={`away-fouls-${num}`} data-active={teamFouls.away?.length >= num}>
                  {num}
                </li>
              ))}
            </ul>
          </div>
        </header>
        <div className={style.layoutContainer}>
          <div className={style.controlCards}>
            <TeamActionController
              teamType="home"
              playerList={playerList ?? []}
              playing={playing}
              setPlaying={setPlaying}
              matchId={Number(matchId)}
              quarter={quarter}
            />
          </div>
          <div>
            <RunningScoreTable
              maxScore={Math.max(teamScores().home || 0, teamScores().away || 0)}
              scores={gameEvents
                .filter(event => ['1', '2', '3'].includes(event.actionType))
                .map(event => ({
                  ...event,
                  playerNo: playerList?.find(p => p.playerId === event.playerId)?.playerNo || -1,
                }))}
            />
            <div>
              <button className={style.button.success} disabled={!timer.isRunning} onClick={handleQuarterEnd}>
                쿼터 종료
              </button>
              <button className={style.button.warning} onClick={handleQuarterStart}>
                {timer.isRunning ? 'TIME OUT' : 'START'}
              </button>
            </div>
          </div>
          <div className={style.controlCards}>
            <TeamActionController
              teamType="away"
              playerList={playerList ?? []}
              playing={playing}
              setPlaying={setPlaying}
              matchId={Number(matchId)}
              quarter={quarter}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default PlayingIdIndex;
