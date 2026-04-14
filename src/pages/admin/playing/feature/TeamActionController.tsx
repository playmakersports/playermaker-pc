import React, { useMemo, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { groupBy } from 'es-toolkit';
import clsx from 'clsx';

import { PlayingActionEnums, type PlayingActionType } from '@/enums/playing.ts';
import { SubPlayerFloatingList } from '@/pages/admin/playing/feature/SubPlayerFloatingList.tsx';
import RecentActionTable from '@/pages/admin/playing/feature/RecentActionTable.tsx';
import { addEventAtom, gameEventsAtom } from '@/store/game-events-atom.ts';
import Icons from '@/share/common/Icons.tsx';

type PlayerInfo = {
  rosterId: number;
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
    rosterId: null,
    actionType: null,
  });
  const [isSubSelected, setIsSubSelected] = useState<boolean>();

  const handlePlayerSelect = (rosterId: number, teamType: Selected['teamType']) => {
    if (!teamType) return;
    if (selected.rosterId === rosterId) {
      if (['1', '2', '3'].includes(selected.actionType!)) {
        addEvent({
          rosterId: selected.rosterId,
          actionType: selected.actionType!,
          quarter,
          teamType,
        });
      }
      setSelected({ actionType: null, teamType: null, rosterId: null });
      setIsSubSelected(false);
      return;
    }
    if (isSubSelected) {
      const player = playerList?.find(p => p.rosterId === selected.rosterId);
      if (player && selected.rosterId && selected.actionType) {
        addEvent({
          rosterId: selected.rosterId,
          actionType: selected.actionType,
          quarter,
          teamType,
        });
        addEvent({
          rosterId,
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
            [teamType]: prev[teamType].filter(id => id !== selected.rosterId).concat(rosterId),
          }));
        }

        setSelected({
          teamType: null,
          rosterId: null,
          actionType: null,
        });
        setIsSubSelected(false);
      }
    } else {
      setSelected(prev => ({ ...prev, rosterId, teamType }));
    }
  };

  const handleActionSelect = (actionType: PlayingActionType | null) => {
    if (!actionType || !selected.teamType) return;
    setSelected(prev => ({ ...prev, actionType }));

    if (selected.rosterId && actionType) {
      if (['1', '2', '3', 'OUT'].includes(actionType)) {
        setIsSubSelected(true);
        setSelected(prev => ({ ...prev, actionType }));
        return;
      } else {
        addEvent({
          teamType: selected.teamType,
          rosterId: selected.rosterId,
          actionType,
          quarter,
        });
      }
    }

    setSelected({
      teamType: null,
      rosterId: null,
      actionType: null,
    });
  };

  const { PF: personalFouls, TF: technicalFouls } = useMemo(() => {
    return groupBy(gameEvents, event => event.actionType);
  }, [gameEvents]);

  return (
    <div className="flex flex-1 flex-col gap-10">
      <div className="grid grid-cols-3 rounded-lg gap-2">
        {playerList
          ?.filter(player => player.teamType === teamType && playing[teamType].includes(player.rosterId))
          .map(player => {
            const playerFouls =
              (personalFouls ?? [])?.filter(f => f.rosterId === player.rosterId).length +
              (technicalFouls ?? [])?.filter(f => f.rosterId === player.rosterId).length;
            const playerTechnicalFouls = technicalFouls?.filter(f => f.rosterId === player.rosterId).length;
            return (
              <button
                type="button"
                key={player.rosterId}
                disabled={
                  selected.actionType === PlayingActionEnums.PLAYER_OUT && selected.rosterId !== player.rosterId
                }
                data-selected={selected.rosterId === player.rosterId}
                className={clsx(
                  'text-2xl font-medium select-none flex py-3 flex-col justify-center items-center bg-info-100 rounded-md cursor-pointer text-center',
                  'hover:bg-info-200 active:bg-info-300',
                  'disabled:bg-gray-100 disabled:text-gray-400',
                  'data-[selected=true]:py-2.5 data-[selected=true]:bg-info-600 data-[selected=true]:text-white data-[selected=true]:border-2 data-[selected=true]:border-white data-[selected=true]:outline-2 data-[selected=true]:outline-info-600',
                )}
                onClick={() => handlePlayerSelect(player.rosterId, teamType)}
              >
                <span className="text-base font-medium">{player.playerName}</span>
                <span className="text-4xl font-medium [font-feature-settings:'cv02','cv04','cv06','cv09','cv13']">
                  {player.playerNo}
                </span>
                {playerTechnicalFouls >= 2 ? (
                  <span style={{ color: 'red', fontWeight: 'bold' }}>아웃</span>
                ) : (
                  <ul className="flex items-center justify-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <li
                        key={`${player.rosterId}-fouls-${index}`}
                        className="inline-flex size-4 rounded-full border-2 border-gray-400 data-[active=true]:bg-gray-600 data-[active=true]:border-gray-600"
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
            className={clsx(
              'text-2xl font-medium select-none w-full h-full flex gap-3 flex-col justify-center items-center border border-gray-300 rounded-md cursor-pointer text-center text-gray-500',
              'hover:bg-gray-50 active:bg-gray-200',
              'disabled:border-none disabled:bg-gray-100 disabled:text-gray-400',
            )}
            disabled={selected.rosterId === null || quarter === 0}
            onClick={() => handleActionSelect(PlayingActionEnums.PLAYER_OUT)}
          >
            <Icons name="refresh" w="bold" t="round" size={24} />
            교체
          </button>
        </SubPlayerFloatingList>
      </div>
      <div className="grid grid-cols-3 rounded-lg gap-2">
        {ACTIONS.map((action, index) =>
          action.type ? (
            <button
              type="button"
              key={action.type}
              disabled={selected.rosterId === null || quarter === 0}
              data-selected={selected.actionType === action.type}
              className={clsx(
                'text-2xl font-medium select-none py-6 bg-primary-200 rounded-md cursor-pointer text-center',
                'hover:bg-primary-300 active:bg-primary-400',
                'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
                'data-[selected=true]:py-3.5 data-[selected=true]:bg-primary-600 data-[selected=true]:text-white data-[selected=true]:border-2 data-[selected=true]:border-white data-[selected=true]:outline-2 data-[selected=true]:outline-primary-600',
              )}
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
  rosterId: number | null;
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
