import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { overlay } from 'overlay-kit';
import { useAtom, useSetAtom } from 'jotai';
import { useLocation, useNavigate, useParams } from 'react-router';
import { groupBy, mapValues, sumBy } from 'es-toolkit';
import { useGetMatchInfo, useGetMatchRoster } from '@/query/match.ts';

import { addEventAtom, gameEventsAtom, pausedEventsAtom, timerAtom } from '@/store/game-events-atom.ts';
import RunningScoreTable from '@/pages/admin/playing/feature/RunningScoreTable.tsx';
import { type PlayingActionType } from '@/enums/playing.ts';
import { timestampToTimerMS } from '@/share/libs/format.ts';
import TeamActionController from '@/pages/admin/playing/feature/TeamActionController.tsx';
import QuarterSummary from './feature/QuarterSummary';
import Icons from '@/share/common/Icons.tsx';
import type { PlayingStarter } from '../match/MatchDetailSection';
import { lib } from '@/share/libs/dialog';

const PLAYING_BTN_BASE =
  'text-2xl font-medium inline-flex items-center gap-[3px] w-full py-2 px-3.5 text-white rounded-lg cursor-pointer border-none disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed';

function PlayingIdIndex() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { matchId } = useParams<{ matchId: string }>();

  const [gameEvents] = useAtom(gameEventsAtom);
  const setPausedEvents = useSetAtom(pausedEventsAtom);
  const [, addEvent] = useAtom(addEventAtom);
  const [timer, setTimer] = useAtom(timerAtom);
  const [currentTime, setCurrentTime] = useState(0);
  const [quarter, setQuarter] = useState(0);

  const [playing, setPlaying] = useState<{ home: number[]; away: number[] }>({ home: [], away: [] });

  const { data } = useGetMatchInfo(Number(matchId));
  const { data: players } = useGetMatchRoster(Number(matchId));

  const playerList = players?.map(item => ({
    rosterId: item.rosterId,
    playerName: item.player.name,
    playerNo: item.player.number,
    teamType: item.teamType,
  }));

  useEffect(() => {
    if (state?.starter) {
      const { starter } = state as { starter: PlayingStarter[] };
      const playersGroupByTeamType = groupBy(starter, obj => obj.teamType);
      setPlaying({
        home: playersGroupByTeamType['home']?.map(p => p.rosterId),
        away: playersGroupByTeamType['away']?.map(p => p.rosterId),
      });
    } else {
      lib.alert({ title: `선발 선수 정보가 없습니다.\n경기 상세에서 선발 선수 선택 후 다시 시도해주세요.` });
      navigate(`/admin/match`);
    }
  }, [state]);

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
    setTimer({
      isRunning: true,
      startTimestamp: Date.now(),
      pausedTime: 0,
    });

    Object.entries(playing).forEach(([teamType, rosterIds]) => {
      rosterIds.forEach(rosterId => {
        addEvent({
          rosterId,
          teamType: teamType as 'home' | 'away',
          actionType: `${quarter + 1}S` as PlayingActionType,
          quarter: quarter + 1,
        });
      });
    });

    setQuarter(prev => prev + 1);
  };
  const handleTimeOut = () => {
    const now = Date.now();

    if (timer.isRunning) {
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

    Object.entries(playing).forEach(([teamType, rosterIds]) => {
      rosterIds.forEach(rosterId => {
        addEvent({
          rosterId,
          teamType: teamType as 'home' | 'away',
          actionType: `${quarter}E` as PlayingActionType,
          quarter,
        });
      });
    });

    overlay.open(controller => (
      <QuarterSummary
        {...controller}
        quarter={quarter}
        players={playerList ?? []}
        handleQuarterStart={handleQuarterStart}
        teamName={{
          home: data?.recordMatchResponseDto.homeTeam.teamName ?? '',
          away: data?.recordMatchResponseDto.awayTeam.teamName ?? '',
        }}
      />
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
        className="text-sm font-normal"
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
      <section
        className="flex gap-8 flex-col p-4 h-screen"
        style={{ flex: 1, ['--center-width' as string]: 'max(140px, 16.5vw)' }}
      >
        <header className="flex gap-4 justify-between">
          <div className="text-2xl font-medium flex-1 text-center">
            <p className="flex items-center justify-center gap-1">
              <span className="text-sm font-semibold py-0.5 px-2 bg-gray-500 rounded-[3px] text-white">HOME</span>{' '}
              {data?.recordMatchResponseDto.homeTeam.teamName}
            </p>
            <ul className="header-team-fouls flex mt-1 justify-center gap-1">
              {[1, 2, 3, 4, 5].map(num => (
                <li key={`home-fouls-${num}`} data-active={teamFouls.home?.length >= num}>
                  {num}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="text-4xl font-semibold flex items-center justify-between gap-3 text-center [font-feature-settings:'cv02','cv04','cv06','cv09','cv13']"
            style={{ width: 'var(--center-width)' }}
          >
            <div style={{ flex: 1 }}>{teamScores().home}</div>
            {quarter === 0 ? (
              <div className="text-2xl font-semibold py-2 min-w-[152px] border-2 border-gray-300 text-gray-700 rounded-xl text-center tabular-nums tracking-[-0.7px]">
                경기시작 전
              </div>
            ) : (
              <div
                className={clsx(
                  'text-2xl font-semibold py-2 min-w-[152px] border-2 border-gray-300 text-gray-700 rounded-xl text-center tabular-nums tracking-[-0.7px]',
                  !timer.isRunning && 'bg-red-500 text-white border-transparent',
                )}
              >
                {quarter}Q - <span className="time">{timestampToTimerMS(currentTime)}</span>
              </div>
            )}
            <div style={{ flex: 1 }}>{teamScores().away}</div>
          </div>
          <div className="text-2xl font-medium flex-1 text-center">
            <p className="flex items-center justify-center gap-1">
              <span className="text-sm font-semibold py-0.5 px-2 bg-gray-500 rounded-[3px] text-white">AWAY</span>{' '}
              {data?.recordMatchResponseDto.awayTeam.teamName}
            </p>
            <ul className="header-team-fouls flex mt-1 justify-center gap-1">
              {[1, 2, 3, 4, 5].map(num => (
                <li key={`away-fouls-${num}`} data-active={teamFouls.away?.length >= num}>
                  {num}
                </li>
              ))}
            </ul>
          </div>
        </header>
        <div className="flex gap-4 justify-between">
          <div className="flex flex-1 flex-col gap-10">
            <TeamActionController
              teamType="home"
              playerList={playerList ?? []}
              playing={playing}
              setPlaying={setPlaying}
              matchId={Number(matchId)}
              quarter={quarter}
            />
          </div>
          <div className="flex items-center flex-col justify-center gap-3">
            <RunningScoreTable
              maxScore={Math.max(teamScores().home || 0, teamScores().away || 0)}
              scores={gameEvents
                .filter(event => ['1', '2', '3'].includes(event.actionType))
                .map(event => ({
                  ...event,
                  playerNo: playerList?.find(p => p.rosterId === event.rosterId)?.playerNo || -1,
                }))}
            />
            <div className="flex items-center flex-col justify-center gap-2">
              {timer.isRunning && (
                <button
                  className={clsx(PLAYING_BTN_BASE, 'bg-red-500 active:bg-red-600')}
                  disabled={!timer.isRunning}
                  onClick={handleQuarterEnd}
                >
                  쿼터종료
                </button>
              )}
              {currentTime !== 0 && (
                <button
                  className={clsx(PLAYING_BTN_BASE, 'bg-warning-500 active:bg-warning-600')}
                  onClick={handleTimeOut}
                >
                  {timer.isRunning ? '타임아웃' : '재개'}
                </button>
              )}
              {!timer.isRunning && currentTime === 0 && (
                <button
                  className={clsx(PLAYING_BTN_BASE, 'bg-info-500 active:bg-info-600')}
                  disabled={timer.isRunning}
                  onClick={handleQuarterStart}
                >
                  시작 <Icons name="running" t="straight" w="bold" size={26} />
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-10">
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
