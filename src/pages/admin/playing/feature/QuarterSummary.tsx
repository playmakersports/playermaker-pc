import { type ComponentProps, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { useMutation } from '@tanstack/react-query';
import type { OverlayControllerComponent } from 'overlay-kit';
import { omitBy } from 'es-toolkit';

import { postMatchStatAdd } from '@/apis/match.ts';
import Button from '@/share/components/Button';
import { gameEventsAtom } from '@/store/game-events-atom.ts';
import { PlayingActionTypeName } from '@/pages/admin/playing/feature/RecentActionTable.tsx';
import { timestampToTimerMS } from '@/share/libs/format.ts';
import { PlayingActionEnums } from '@/enums/playing.ts';
import Icons from '@/share/common/Icons.tsx';

type PlayerInfo = {
  rosterId: number;
  playerName: string;
  playerNo: number;
  teamType: 'home' | 'away';
};
type Props = ComponentProps<OverlayControllerComponent> & {
  quarter: number;
  handleQuarterStart: () => void;
  players: PlayerInfo[];
  teamName: {
    home: string;
    away: string;
  };
};
function QuarterSummary(props: Props) {
  const { isOpen, close, unmount, quarter, handleQuarterStart, players, teamName } = props;
  const [selected, setSelected] = useState<string | null>(null);
  const [restTime, setRestTime] = useState(0);

  const [gameEvents] = useAtom(gameEventsAtom);
  const quarterEvents = gameEvents.filter(event => event.quarter === quarter);
  const quarterStartTime = quarterEvents[0]?.timestamp ?? 0;
  const isFourthQuarter = gameEvents.slice(-1)[0].actionType === '4E';

  const EXCLUDED_ACTION_PATTERNS = ['START', 'END', 'IN', 'OUT', '1S'] as const;
  const editableActionTypes = omitBy(PlayingActionEnums, (_, key) =>
    EXCLUDED_ACTION_PATTERNS.some(pattern => key.includes(pattern)),
  );

  const { mutate } = useMutation({
    mutationFn: postMatchStatAdd,
  });

  const onClickQuarterStart = () => {
    handleQuarterStart();
    close();
    setTimeout(() => unmount(), 300);
  };
  const onClickEndSubmit = () => {
    mutate(gameEvents, {
      onSuccess: () => {
        close();
        setTimeout(() => unmount(), 300);
      },
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRestTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      data-open={isOpen}
      className="fixed left-0 top-0 w-screen h-screen bg-black/25 opacity-0 transition-opacity duration-300 ease-in-out z-50 flex px-7 justify-center items-center data-[open=true]:opacity-100"
    >
      <div
        className="w-full max-w-[1200px] h-[80vh] max-h-[80vh] bg-white rounded-3xl pt-8 px-8 shadow-lg translate-y-10 opacity-0 transition-[transform,opacity] duration-[250ms,300ms] ease-in-out flex flex-col data-[open=true]:translate-y-0 data-[open=true]:opacity-100"
        data-open={isOpen}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{quarter}쿼터 종료: 기록을 확인해 보세요</h2>
            <p className="text-sm font-normal">기록을 선택하면, 내용을 수정할 수 있어요</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="text-base font-normal text-primary-600">휴식 {timestampToTimerMS(restTime * 1000)}</div>
            <Button type="button" size="large" theme="primary" onClick={onClickQuarterStart}>
              쿼터 시작
            </Button>
            {isFourthQuarter && (
              <Button type="button" size="large" theme="red" onClick={onClickEndSubmit}>
                경기종료 및 저장
              </Button>
            )}
          </div>
        </div>

        <div className="flex mx-[-4px] mt-5 h-full gap-5 justify-between flex-1 min-h-0">
          <ul className="w-[240px] inline-flex flex-col gap-3 overflow-y-auto h-full pr-3 pb-8">
            {quarterEvents
              .filter(evt => evt.teamType !== null && !/(^\d[SE])$/.test(evt.actionType))
              .map(event => {
                const eventId = `${event.timestamp}#${event.actionType}@${event.rosterId}`;
                const { playerName, playerNo } = players?.find(p => p.rosterId === event.rosterId) ?? {
                  playerName: null,
                  playerNo: null,
                };

                return (
                  <li
                    key={eventId}
                    className="text-sm font-normal cursor-pointer select-none py-3 px-4 rounded-2xl bg-gray-100 border border-transparent data-[selected=true]:border-primary-500 data-[selected=true]:bg-white data-[selected=true]:text-primary-700"
                    data-selected={selected === eventId}
                    onClick={() => setSelected(eventId)}
                  >
                    <p className="flex items-center justify-between">
                      <span>
                        {playerNo} {playerName}
                      </span>
                      <span>{PlayingActionTypeName[event.actionType]}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>{timestampToTimerMS(event.timestamp - quarterStartTime)}</span>
                      <span>{teamName?.[event.teamType as 'home' | 'away']}</span>
                    </p>
                  </li>
                );
              })}
          </ul>
          <div className="flex-1 flex flex-col gap-7">
            <div className="flex items-start flex-col justify-center gap-2">
              <h3 className="text-base font-medium">선수 변경</h3>
              <div className="grid w-full grid-cols-4 gap-3">
                {players.map(player => (
                  <label
                    key={`${player.rosterId}+${player.playerName}`}
                    htmlFor={`${player.rosterId}+${player.playerName}`}
                    className="radio-card text-sm font-normal cursor-pointer flex justify-between items-center gap-1 py-3 px-4 rounded-lg bg-transparent border border-gray-300"
                  >
                    <input type="radio" name="player" id={player.rosterId.toString()} style={{ display: 'none' }} />
                    <p className="flex items-start flex-col justify-center">
                      <span className="text-base font-medium">
                        ({player.playerNo}) {player.playerName}
                      </span>
                      <span>{teamName?.[player.teamType]}</span>
                    </p>
                    <Icons name="check" size={16} w="bold" t="straight" />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-start flex-col justify-center gap-1">
              <h3 className="text-base font-medium">액션 타입 변경</h3>
              <div className="grid w-full grid-cols-4 gap-3">
                {Object.entries(editableActionTypes).map(([actionKey, actionValue]) => (
                  <label
                    key={actionKey}
                    htmlFor={actionKey}
                    className="radio-card text-sm font-normal cursor-pointer flex justify-between items-center gap-1 py-3 px-4 rounded-lg bg-transparent border border-gray-300"
                  >
                    <input type="radio" name="actionType" id={actionKey} style={{ display: 'none' }} />
                    <span className="text-base font-medium">{PlayingActionTypeName[actionValue!]}</span>
                    <Icons name="check" size={16} w="bold" t="straight" />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuarterSummary;
