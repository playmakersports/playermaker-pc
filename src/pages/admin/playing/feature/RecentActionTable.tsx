import { memo, useCallback, useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { groupBy, orderBy } from 'es-toolkit';

import Button from '@/share/components/Button.tsx';
import Icons from '@/share/common/Icons.tsx';
import { gameEventsAtom, pausedEventsAtom, popEventAtom } from '@/store/game-events-atom.ts';
import { PlayingActionEnums } from '@/enums/playing.ts';
import { calculateGameTime, timestampToTimerMS } from '@/share/libs/format.ts';

type Props = {
  quarter: number;
  teamType: 'home' | 'away';
  playerList: {
    rosterId: number;
    playerName: string;
    playerNo: number;
    teamType: 'home' | 'away';
  }[];
};
function RecentActionTable({ quarter, teamType, playerList }: Props) {
  const actions = useAtomValue(gameEventsAtom);
  const pausedEvents = useAtomValue(pausedEventsAtom);
  const quarterActions = groupBy(actions, a => a.quarter);
  const popEvent = useSetAtom(popEventAtom);

  const quarterStartTimestamp = actions.find(action => action.actionType === `${quarter}S`)?.timestamp ?? 0;
  const recent = orderBy(
    actions.filter(action => action.quarter === quarter && action.teamType === teamType),
    [action => action.timestamp],
    ['desc'],
  ).slice(0, 12);

  const handleUndoAction = useCallback(() => {
    if (!(quarterActions[quarter]?.length > 1)) return;
    const lastActionType = actions.slice(-1)[0].actionType;
    popEvent(teamType);
    if (lastActionType === PlayingActionEnums.PLAYER_IN || lastActionType === PlayingActionEnums.ASSIST) {
      popEvent(teamType);
    }
  }, [actions, popEvent, teamType]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
      const isUndoShortcut = isMac
        ? event.metaKey && event.key === 'Backspace'
        : event.ctrlKey && event.key === 'Backspace';

      if (isUndoShortcut && quarterActions[quarter]?.length > 1) {
        event.preventDefault();
        handleUndoAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleUndoAction, quarterActions, quarter]);

  return (
    <div>
      <div className="my-6 mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">진행상황</h2>
        <div className="hover-parent relative">
          <Button
            type="button"
            size="small"
            theme="red"
            fillType="default"
            icon={<Icons name="rotate-left" w="bold" t="round" size={16} />}
            onClick={handleUndoAction}
            disabled={!(quarterActions[quarter]?.length > 1)}
          ></Button>
          <div className="hover-info text-sm font-medium absolute flex items-center right-0 top-full w-max mt-1.5 py-1 px-2 bg-gray-500 text-white rounded-sm gap-1 opacity-0 transition-[opacity,transform] duration-[200ms,300ms] -translate-y-full">
            실행취소
            <span className="key">
              <Icons name="command" w="regular" t="round" size={14} />
              <Icons name="delete" w="regular" t="round" size={14} />
            </span>
          </div>
        </div>
      </div>

      <ul className="grid grid-cols-2 grid-rows-[repeat(6,1fr)] grid-flow-col gap-x-5 gap-y-1">
        {recent.map(action => {
          return (
            <li
              key={`${action.timestamp}-${action.rosterId}-${action.actionType}`}
              className="text-base font-normal max-w-[300px] flex gap-2 items-center [font-feature-settings:'cv02','cv04','cv06','cv09','cv13'] tabular-nums"
            >
              <span className="text-base font-medium mr-[-2px] min-w-[46px] text-gray-500 tracking-[-0.25px]">
                {timestampToTimerMS(calculateGameTime(action.timestamp, quarterStartTimestamp, pausedEvents, quarter))}
              </span>
              <span className="text-sm font-semibold min-w-[38px] max-w-[38px] text-center p-[1px] bg-gray-200 text-gray-600 rounded-sm">
                {playerList?.find(player => player.rosterId === action.rosterId)?.playerNo}
              </span>
              <span>{playerList?.find(player => player.rosterId === action.rosterId)?.playerName}</span>
              <span>{PlayingActionTypeName[action.actionType]}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export const PlayingActionTypeName: Record<string, string> = {
  [PlayingActionEnums.P_FOUL]: '파울P',
  [PlayingActionEnums.OF_FOUL]: '파울O',
  [PlayingActionEnums.TF_FOUL]: '파울T',
  [PlayingActionEnums.STEAL]: '스틸',
  [PlayingActionEnums.ATTACK_REBOUND]: '공격리바',
  [PlayingActionEnums.DEFENCE_REBOUND]: '수비리바',
  [PlayingActionEnums.BLOCK]: '블락',
  [PlayingActionEnums.TURNOVER]: '턴오버',
  [PlayingActionEnums.POINT1]: '1점',
  [PlayingActionEnums.POINT2]: '2점',
  [PlayingActionEnums.POINT3]: '3점',
  [PlayingActionEnums.ASSIST]: '어시스트',
  [PlayingActionEnums.PLAYER_IN]: '교체-IN',
  [PlayingActionEnums.PLAYER_OUT]: '교체-OUT',
} as const;

export default memo(RecentActionTable);
