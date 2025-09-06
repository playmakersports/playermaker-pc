import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useParams } from 'react-router';
import { groupBy, mapValues, sumBy } from 'es-toolkit';

import { fonts } from '@/style/typo.css.ts';
import { playingStyle as style } from '@/pages/admin/playing/playing.css.ts';
import { addEventAtom, gameEventsAtom, timerAtom } from '@/store/game-events-atom.ts';
import RunningScoreTable from '@/pages/admin/playing/feature/RunningScoreTable.tsx';
import { PlayingActionEnums, type PlayingActionType } from '@/share/enums/playing.ts';

function PlayingIdIndex() {
  const { matchId } = useParams<{ matchId: string }>();
  const [selected, setSelected] = useState<Selected>({
    playerId: null,
    actionType: null,
  });
  const [gameEvents] = useAtom(gameEventsAtom);
  const [, addEvent] = useAtom(addEventAtom);
  const [timer, setTimer] = useAtom(timerAtom);
  const [currentTime, setCurrentTime] = useState(0);
  const PLAYERS = [
    { playerId: 123, playerName: '김지훈', playerNo: 1, teamId: 'home' },
    { playerId: 1223, playerName: '이지훈', playerNo: 21, teamId: 'home' },
    { playerId: 1423, playerName: '박지훈', playerNo: 7, teamId: 'home' },
    { playerId: 7123, playerName: '최지훈', playerNo: 9, teamId: 'home' },
    { playerId: 6723, playerName: '공지훈', playerNo: 11, teamId: 'home' },
    { playerId: 3100, playerName: '홍민지', playerNo: 3, teamId: 'away' },
    { playerId: 2100, playerName: '김민지', playerNo: 31, teamId: 'away' },
    { playerId: 660, playerName: '박민지', playerNo: 8, teamId: 'away' },
    { playerId: 60, playerName: '송민지', playerNo: 5, teamId: 'away' },
    { playerId: 70, playerName: '안민지', playerNo: 12, teamId: 'away' },
  ];
  const ACTIONS = [
    { type: PlayingActionEnums.POINT1, name: '1점' },
    { type: PlayingActionEnums.POINT2, name: '2점' },
    { type: PlayingActionEnums.POINT3, name: '3점' },
    { type: PlayingActionEnums.ATTACK_REBOUND, name: '공격리바' },
    { type: PlayingActionEnums.DEFENCE_REBOUND, name: '수비리바' },
    { type: PlayingActionEnums.BLOCK, name: '블락' },
    { type: PlayingActionEnums.STEAL, name: '스틸' },
    { type: PlayingActionEnums.TURNOVER, name: '턴오버' },
    { type: null, name: null },
    { type: PlayingActionEnums.P_FOUL, name: '파울P' },
    { type: PlayingActionEnums.OF_FOUL, name: '파울O' },
    { type: PlayingActionEnums.TF_FOUL, name: '파울T' },
  ];

  const handlePlayerSelect = (playerId: number) => {
    setSelected(prev => ({ ...prev, playerId }));
  };

  const handleActionSelect = (actionType: PlayingActionType | null) => {
    if (!actionType) return;

    setSelected(prev => ({ ...prev, actionType }));

    if (selected.playerId && actionType) {
      const player = PLAYERS.find(p => p.playerId === selected.playerId);
      if (player) {
        addEvent({
          playerId: selected.playerId,
          actionType,
          teamId: player.teamId as 'home' | 'away',
        });
      }
    }

    setSelected({
      playerId: null,
      actionType: null,
    });
  };

  const teamScores = () => {
    return mapValues(
      groupBy(
        gameEvents.filter(event => ['1', '2', '3'].includes(event.actionType)),
        event => event.teamId,
      ),
      items => sumBy(items, event => Number(event.actionType)),
    );
  };

  const playerFouls = useMemo(() => {
    const personalFouls: Record<number, number> = {};
    const technicalFouls: Record<number, number> = {};

    gameEvents.forEach(event => {
      if (event.actionType === PlayingActionEnums.P_FOUL || event.actionType === PlayingActionEnums.OF_FOUL) {
        personalFouls[event.playerId] = (personalFouls[event.playerId] || 0) + 1;
      } else if (event.actionType === PlayingActionEnums.TF_FOUL) {
        technicalFouls[event.playerId] = (technicalFouls[event.playerId] || 0) + 1;
      }
    });

    return { personalFouls, technicalFouls };
  }, [gameEvents]);

  const teamFouls = useMemo(() => {
    const homeFouls = gameEvents.filter(event => {
      if (event.actionType !== PlayingActionEnums.P_FOUL) return false;
      const player = PLAYERS.find(p => p.playerId === event.playerId);
      return player?.teamId === 'home';
    }).length;

    const awayFouls = gameEvents.filter(event => {
      if (event.actionType !== PlayingActionEnums.P_FOUL) return false;
      const player = PLAYERS.find(p => p.playerId === event.playerId);
      return player?.teamId === 'away';
    }).length;

    return { homeFouls, awayFouls };
  }, [gameEvents, PLAYERS]);

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
    } else {
      // 타이머 시작
      setTimer({
        isRunning: true,
        startTimestamp: now,
        pausedTime: timer.pausedTime,
      });
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
            <p>HOME 팀이름</p>
            <ul className={style.headerTeamFouls}>
              <li data-active={teamFouls.homeFouls >= 1}>1</li>
              <li data-active={teamFouls.homeFouls >= 2}>2</li>
              <li data-active={teamFouls.homeFouls >= 3}>3</li>
              <li data-active={teamFouls.homeFouls >= 4}>4</li>
              <li data-active={teamFouls.homeFouls >= 5}>5</li>
            </ul>
          </div>
          <div className={style.headerCenter}>
            <div style={{ flex: 1 }}>{teamScores().home}</div>
            <div className={clsx(style.playingScore, { [style.playingTimeout]: !timer.isRunning })}>
              1Q - <span className="time">{formatTime(currentTime)}</span>
            </div>
            <div style={{ flex: 1 }}>{teamScores().away}</div>
          </div>
          <div className={style.headerTeam}>
            <p>AWAY 팀이름</p>
            <ul className={style.headerTeamFouls}>
              <li data-active={teamFouls.awayFouls >= 1}>1</li>
              <li data-active={teamFouls.awayFouls >= 2}>2</li>
              <li data-active={teamFouls.awayFouls >= 3}>3</li>
              <li data-active={teamFouls.awayFouls >= 4}>4</li>
              <li data-active={teamFouls.awayFouls >= 5}>5</li>
            </ul>
          </div>
        </header>
        <div className={style.layoutContainer}>
          <div className={style.controlCards}>
            <div className={style.playersList}>
              {PLAYERS.filter(player => player.teamId === 'home').map(player => (
                <button
                  type="button"
                  key={player.playerId}
                  data-selected={selected.playerId === player.playerId}
                  className={style.playerButton}
                  onClick={() => handlePlayerSelect(player.playerId)}
                >
                  <span>{player.playerNo}</span>
                  {player.playerName}{' '}
                  {playerFouls.technicalFouls[player.playerId] >= 2 ? (
                    <span style={{ color: 'red', fontWeight: 'bold' }}>아웃</span>
                  ) : (
                    <span>
                      (
                      {(playerFouls.personalFouls[player.playerId] || 0) +
                        (playerFouls.technicalFouls[player.playerId] || 0)}
                      )
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className={style.actionsList}>
              {ACTIONS.map(action =>
                action.type ? (
                  <button
                    type="button"
                    key={action.type}
                    data-selected={selected.actionType === action.type}
                    className={style.actionButton}
                    onClick={() => handleActionSelect(action.type)}
                  >
                    {action.name}
                  </button>
                ) : (
                  <div></div>
                ),
              )}
            </div>
          </div>
          <RunningScoreTable
            maxScore={Math.max(teamScores().home, teamScores().away)}
            scores={gameEvents
              .filter(event => ['1', '2', '3'].includes(event.actionType))
              .map(event => ({
                ...event,
                playerNo: PLAYERS.find(p => p.playerId === event.playerId)?.playerNo || -1,
              }))}
          />
          <div className={style.controlCards}>
            <div className={style.playersList}>
              {PLAYERS.filter(player => player.teamId === 'away').map(player => (
                <button
                  type="button"
                  key={player.playerId}
                  data-selected={selected.playerId === player.playerId}
                  className={style.playerButton}
                  onClick={() => handlePlayerSelect(player.playerId)}
                >
                  <span>{player.playerNo}</span>
                  {player.playerName}{' '}
                  {playerFouls.technicalFouls[player.playerId] >= 2 ? (
                    <span style={{ color: 'red', fontWeight: 'bold' }}>아웃</span>
                  ) : (
                    <span>
                      (
                      {(playerFouls.personalFouls[player.playerId] || 0) +
                        (playerFouls.technicalFouls[player.playerId] || 0)}
                      )
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className={style.actionsList}>
              {ACTIONS.map(action =>
                action.type ? (
                  <button
                    type="button"
                    key={action.type}
                    data-selected={selected.actionType === action.type}
                    className={style.actionButton}
                    onClick={() => handleActionSelect(action.type)}
                  >
                    {action.name}
                  </button>
                ) : (
                  <div></div>
                ),
              )}
            </div>
          </div>
        </div>
        <div className={style.layoutContainer}>
          <div className="summary"></div>
          <div>
            <button className={style.button.success}>쿼터 종료</button>
            <button className={style.button.warning} onClick={handleTimerToggle}>
              {timer.isRunning ? 'TIME OUT' : 'START'}
            </button>
          </div>
          <div className="summary"></div>
        </div>
      </section>
    </div>
  );
}

interface Selected {
  playerId: number | null;
  actionType: PlayingActionType | null;
}

export default PlayingIdIndex;
