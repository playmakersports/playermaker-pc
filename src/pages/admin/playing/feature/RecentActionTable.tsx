import React, { memo, useCallback, useEffect } from 'react';
import { recentActionStyle as style } from '@/pages/admin/playing/feature/css/recent-action-list.css.ts';
import { useAtomValue, useSetAtom } from 'jotai/index';
import { gameEventsAtom, pausedEventsAtom, popEventAtom } from '@/store/game-events-atom.ts';
import { groupBy, sortBy } from 'es-toolkit';
import { PlayingActionEnums } from '@/enums/playing.ts';
import { timestampToTimerMS, calculateGameTime } from '@/share/libs/format.ts';
import { flexs } from '@/style/container.css.ts';
import Button from '@/share/components/Button.tsx';
import Icons from '@/share/common/Icons.tsx';
import clsx from 'clsx';
import { fonts } from '@/style/typo.css.ts';

type Props = {
  quarter: number;
  teamType: 'home' | 'away';
  playerList: {
    playerId: number;
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
  const recent = sortBy(
    actions.filter(action => action.quarter === quarter && action.teamType === teamType),
    [action => action.timestamp],
  ).reverse();

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
      <div
        className={clsx(
          style.title,
          flexs({
            justify: 'spb',
          }),
        )}
      >
        <h2 className={fonts.body1.semibold}>진행상황</h2>
        <div className={style.hover}>
          <Button
            type="button"
            size="small"
            theme="red"
            fillType="default"
            icon={<Icons name="rotate-left" w="bold" t="round" size={16} />}
            onClick={handleUndoAction}
            disabled={!(quarterActions[quarter]?.length > 1)}
          ></Button>
          <div className={style.hoverInfo}>
            실행취소
            <span className="key">
              <Icons name="command" w="regular" t="round" size={14} />
              <Icons name="delete" w="regular" t="round" size={14} />
            </span>
          </div>
        </div>
      </div>
      <ul className={style.container}>
        {recent.map(action => {
          return (
            <li key={`${action.timestamp}-${action.actionType}`} className={style.action}>
              <span className={style.time}>
                {timestampToTimerMS(calculateGameTime(action.timestamp, quarterStartTimestamp, pausedEvents, quarter))}
              </span>
              <span className={style.playerNum}>
                {playerList?.find(player => player.playerId === action.playerId)?.playerNo}
              </span>
              <span>{playerList?.find(player => player.playerId === action.playerId)?.playerName}</span>
              <span>{ACTION_NAME[action.actionType]}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const ACTION_NAME: Record<string, string> = {
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
