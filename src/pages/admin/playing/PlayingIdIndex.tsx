import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { overlay } from 'overlay-kit';
import { useAtom, useSetAtom } from 'jotai';
import { useParams } from 'react-router';
import { groupBy, mapValues, sumBy } from 'es-toolkit';
import { useGetMatchInfo } from '@/query/match.ts';

import { fonts } from '@/style/typo.css.ts';
import { playingStyle as style } from '@/pages/admin/playing/playing.css.ts';
import { addEventAtom, gameEventsAtom, pausedEventsAtom, timerAtom } from '@/store/game-events-atom.ts';
import RunningScoreTable from '@/pages/admin/playing/feature/RunningScoreTable.tsx';
import { type PlayingActionType } from '@/enums/playing.ts';
import { flexs } from '@/style/container.css.ts';
import { timestampToTimerMS } from '@/share/libs/format.ts';
import TeamActionController from '@/pages/admin/playing/feature/TeamActionController.tsx';
import QuarterSummary from './feature/QuarterSummary';
import Icons from '@/share/common/Icons.tsx';

function PlayingIdIndex() {
  const { matchId } = useParams<{ matchId: string }>();

  const [gameEvents] = useAtom(gameEventsAtom);
  const setPausedEvents = useSetAtom(pausedEventsAtom);
  const [, addEvent] = useAtom(addEventAtom);
  const [timer, setTimer] = useAtom(timerAtom);
  const [currentTime, setCurrentTime] = useState(0);
  const [quarter, setQuarter] = useState(0);

  const [playing, setPlaying] = useState<{ home: number[]; away: number[] }>({ home: [], away: [] });

  const { data } = useGetMatchInfo(Number(matchId));
  const playerList = data?.playlists.map(player => ({
    playListId: player.playListId,
    playerName: player.player.name,
    playerNo: player.player.number,
    teamType: (player.homeYn ? 'home' : 'away') as 'home' | 'away',
  }));

  useEffect(() => {
    if (data) {
      // 선발 선수 설정
      setPlaying({
        home: data.playlists.filter(p => p.homeYn && p.starter).map(p => p.playListId),
        away: data.playlists.filter(p => !p.homeYn && p.starter).map(p => p.playListId),
      });
    }
  }, [data]);

  /**
   * 팀 점수 집계 함수
   */
  const teamScores = () => {
    return mapValues(
      groupBy(
        gameEvents.filter(event => ['1', '2', '3'].includes(event.actionType)),
        event => event.teamType!,
      ),
      items => sumBy(items, event => Number(event.actionType)),
    );
  };
  /**
   * 팀 파울 집계 함수
   */
  const teamFouls = useMemo(() => {
    const { PF: personalFouls } = groupBy(gameEvents, event => event.actionType);
    return groupBy(
      (personalFouls ?? []).filter(f => f.quarter === quarter),
      f => f.teamType!,
    );
  }, [gameEvents]);

  const handleQuarterStart = () => {
    setTimer({
      isRunning: true,
      startTimestamp: Date.now(),
      pausedTime: 0,
    });
    addEvent({
      playListId: null,
      teamType: null,
      actionType: `${quarter + 1}S` as PlayingActionType,
      quarter: quarter + 1,
    });
    setQuarter(prev => prev + 1);
  };
  const handleTimeOut = () => {
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
    setTimer({
      isRunning: false,
      startTimestamp: null,
      pausedTime: 0,
    });
    addEvent({
      playListId: null,
      teamType: null,
      actionType: `${quarter}E` as PlayingActionType,
      quarter,
    });
    overlay.open(controller => (
      <QuarterSummary {...controller} quarter={quarter} handleQuarterStart={handleQuarterStart} />
    ));
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

  const [hideDataView, setHideDataView] = useState(false);
  return (
    <div style={{ display: 'flex' }}>
      <button
        type="button"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          backgroundColor: 'yellow',
          width: '40px',
          height: '40px',
        }}
        onClick={() => setHideDataView(prev => !prev)}
      >
        데이터
      </button>
      <div
        className={fonts.body4.regular}
        style={{
          display: hideDataView ? 'none' : 'block',
          padding: '48px 10px 12px',
          width: '200px',
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <p>{JSON.stringify(gameEvents).replaceAll('}', '}\n')}</p>
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
            {quarter === 0 ? (
              <div className={style.playingScore}>경기시작 전</div>
            ) : (
              <div className={clsx(style.playingScore, { [style.playingTimeout]: !timer.isRunning })}>
                {quarter}Q - <span className="time">{timestampToTimerMS(currentTime)}</span>
              </div>
            )}
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
          <div className={flexs({ dir: 'col', gap: '12' })}>
            <RunningScoreTable
              maxScore={Math.max(teamScores().home || 0, teamScores().away || 0)}
              scores={gameEvents
                .filter(event => ['1', '2', '3'].includes(event.actionType))
                .map(event => ({
                  ...event,
                  playerNo: playerList?.find(p => p.playListId === event.playListId)?.playerNo || -1,
                }))}
            />
            <div className={flexs({ dir: 'col', gap: '8' })}>
              {timer.isRunning && (
                <button className={style.button.red} disabled={!timer.isRunning} onClick={handleQuarterEnd}>
                  쿼터종료
                </button>
              )}
              {currentTime !== 0 && (
                <button className={style.button.warning} onClick={handleTimeOut}>
                  {timer.isRunning ? '타임아웃' : '재개'}
                </button>
              )}
              {!timer.isRunning && currentTime === 0 && (
                <button className={style.button.info} disabled={timer.isRunning} onClick={handleQuarterStart}>
                  시작 <Icons name="running" t="straight" w="bold" size={26} />
                </button>
              )}
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
