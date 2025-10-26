import React, { useMemo, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { groupBy } from 'es-toolkit';

import { fonts } from '@/style/typo.css.ts';
import { playingStyle as style } from '@/pages/admin/playing/playing.css.ts';
import { PlayingActionEnums, type PlayingActionType } from '@/enums/playing.ts';
import { SubPlayerFloatingList } from '@/pages/admin/playing/feature/SubPlayerFloatingList.tsx';
import RecentActionTable from '@/pages/admin/playing/feature/RecentActionTable.tsx';
import { addEventAtom, gameEventsAtom } from '@/store/game-events-atom.ts';
import Icons from '@/share/common/Icons.tsx';
import { flexs } from '@/style/container.css.ts';

type PlayerInfo = {
  playerId: number;
  playerName: string;
  playerNo: number;
  teamType: 'home' | 'away';
};
type Props = {
  teamType: 'home' | 'away';
  matchId: number;
  playerList: PlayerInfo[];
  playing: { home: number[]; away: number[] };
  setPlaying: React.Dispatch<React.SetStateAction<Props['playing']>>;
  quarter: number;
};
function TeamActionController(props: Props) {
  const { teamType, matchId, playerList, playing, setPlaying, quarter } = props;
  const [gameEvents] = useAtom(gameEventsAtom);
  const addEvent = useSetAtom(addEventAtom);
  const [selected, setSelected] = useState<Selected>({
    teamType: null,
    playerId: null,
    actionType: null,
  });
  const [isSubSelected, setIsSubSelected] = useState<boolean>();

  const handlePlayerSelect = (playerId: number, teamType: Selected['teamType']) => {
    if (!teamType) return;
    if (selected.playerId === playerId) {
      if (['1', '2', '3'].includes(selected.actionType!)) {
        // 점수 득점시 본인을 다시 선택한 경우는, 어시스트 없이 기록
        addEvent({
          playerId: selected.playerId,
          actionType: selected.actionType!,
          quarter,
          teamType,
        });
      }
      setSelected({ actionType: null, teamType: null, playerId: null });
      setIsSubSelected(false);
      return;
    }
    if (isSubSelected) {
      // 득점의 경우, 어시스트 선수를 선택함
      const player = playerList?.find(p => p.playerId === selected.playerId);
      if (player && selected.playerId && selected.actionType) {
        // 득점자 기록
        addEvent({
          playerId: selected.playerId,
          actionType: selected.actionType,
          quarter,
          teamType,
        });
        // 어시스트 혹은 교체 IN 기록
        addEvent({
          playerId,
          actionType:
            selected.actionType === PlayingActionEnums.PLAYER_OUT
              ? PlayingActionEnums.PLAYER_IN
              : PlayingActionEnums.ASSIST,
          quarter,
          teamType,
        });

        if (selected.actionType === PlayingActionEnums.PLAYER_OUT) {
          setPlaying(prev => ({
            ...prev,
            [teamType]: prev[teamType].filter(id => id !== selected.playerId).concat(playerId),
          }));
        }

        setSelected({
          teamType: null,
          playerId: null,
          actionType: null,
        });
        setIsSubSelected(false);
      }
    } else {
      // 어시스트가 아닌 경우
      setSelected(prev => ({ ...prev, playerId, teamType }));
    }
  };

  const handleActionSelect = (actionType: PlayingActionType | null) => {
    if (!actionType || !selected.teamType) return;
    setSelected(prev => ({ ...prev, actionType }));

    if (selected.playerId && actionType) {
      // 득점 혹은 교체 액션인 경우,
      if (['1', '2', '3', 'OUT'].includes(actionType)) {
        setIsSubSelected(true);
        setSelected(prev => ({ ...prev, actionType }));
        return;
      } else {
        addEvent({
          teamType: selected.teamType,
          playerId: selected.playerId,
          actionType,
          quarter,
        });
      }
    }

    setSelected({
      teamType: null,
      playerId: null,
      actionType: null,
    });
  };

  const { PF: personalFouls, TF: technicalFouls } = useMemo(() => {
    return groupBy(gameEvents, event => event.actionType);
  }, [gameEvents]);

  return (
    <div className={style.controlCards}>
      <div className={style.playersList}>
        {playerList
          ?.filter(player => player.teamType === teamType && playing[teamType].includes(player.playerId))
          .map(player => {
            const playerFouls =
              personalFouls?.filter(f => f.playerId === player.playerId).length +
              technicalFouls?.filter(f => f.playerId === player.playerId).length;
            const playerTechnicalFouls = technicalFouls?.filter(f => f.playerId === player.playerId).length;
            return (
              <button
                type="button"
                key={player.playerId}
                disabled={
                  selected.actionType === PlayingActionEnums.PLAYER_OUT && selected.playerId !== player.playerId
                }
                data-selected={selected.playerId === player.playerId}
                className={style.playerButton}
                onClick={() => handlePlayerSelect(player.playerId, teamType)}
              >
                <span className={fonts.body3.medium}>{player.playerName}</span>
                <span className={style.subNumberText}>{player.playerNo}</span>
                {playerTechnicalFouls >= 2 ? (
                  <span style={{ color: 'red', fontWeight: 'bold' }}>아웃</span>
                ) : (
                  <ul className={flexs({ gap: '2' })}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <li
                        key={`${player.playerId}-fouls-${index}`}
                        className={style.playerFoulCount}
                        data-active={index + 1 <= playerFouls}
                      />
                    ))}
                  </ul>
                )}
              </button>
            );
          })}
        <SubPlayerFloatingList
          matchId={Number(matchId)}
          playingIds={playing[teamType]}
          teamType={teamType}
          onSelected={playerId => {
            handlePlayerSelect(playerId, teamType);
          }}
        >
          <button
            type="button"
            className={style.playerChangeButton}
            disabled={selected.playerId === null}
            onClick={() => handleActionSelect(PlayingActionEnums.PLAYER_OUT)}
          >
            <Icons name="refresh" w="bold" t="round" size={24} />
            교체
          </button>
        </SubPlayerFloatingList>
      </div>
      <div className={style.actionsList}>
        {ACTIONS.map((action, index) =>
          action.type ? (
            <button
              type="button"
              key={action.type}
              disabled={selected.playerId === null}
              data-selected={selected.actionType === action.type}
              className={style.actionButton}
              onClick={() => handleActionSelect(action.type)}
            >
              {action.name}
            </button>
          ) : (
            <div key={index}></div>
          ),
        )}
      </div>
      <RecentActionTable quarter={quarter} teamType={teamType} playerList={playerList ?? []} />
    </div>
  );
}

interface Selected {
  teamType: 'home' | 'away' | null;
  playerId: number | null;
  actionType: PlayingActionType | null;
}

const ACTIONS = [
  { type: PlayingActionEnums.POINT1, name: '1점' },
  { type: PlayingActionEnums.POINT2, name: '2점' },
  { type: PlayingActionEnums.POINT3, name: '3점' },
  { type: PlayingActionEnums.ATTACK_REBOUND, name: '공격리바' },
  { type: PlayingActionEnums.DEFENCE_REBOUND, name: '수비리바' },
  { type: null, name: null },
  { type: PlayingActionEnums.BLOCK, name: '블락' },
  { type: PlayingActionEnums.STEAL, name: '스틸' },
  { type: PlayingActionEnums.TURNOVER, name: '턴오버' },
  { type: PlayingActionEnums.P_FOUL, name: '파울P' },
  { type: PlayingActionEnums.OF_FOUL, name: '파울O' },
  { type: PlayingActionEnums.TF_FOUL, name: '파울T' },
] as const;

export default TeamActionController;
