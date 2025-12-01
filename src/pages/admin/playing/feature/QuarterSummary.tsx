import { type ComponentProps, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { useMutation } from '@tanstack/react-query';
import type { OverlayControllerComponent } from 'overlay-kit';
import { omitBy } from 'es-toolkit';

import { postMatchStatAdd } from '@/apis/match.ts';
import Button from '@/share/components/Button';
import { summaryStyle } from './css/quarter-summary.css';
import { fonts } from '@/style/typo.css';
import { flexs } from '@/style/container.css';
import { gameEventsAtom } from '@/store/game-events-atom.ts';
import { PlayingActionTypeName } from '@/pages/admin/playing/feature/RecentActionTable.tsx';
import { timestampToTimerMS } from '@/share/libs/format.ts';
import { PlayingActionEnums } from '@/enums/playing.ts';
import Icons from '@/share/common/Icons.tsx';

type PlayerInfo = {
  playListId: number;
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
    <section data-open={isOpen} className={summaryStyle.container}>
      <div className={summaryStyle.inner} data-open={isOpen}>
        <div className={flexs({ justify: 'spb' })}>
          <div>
            <h2 className={fonts.body1.semibold}>{quarter}쿼터 종료: 기록을 확인해 보세요</h2>
            <p className={fonts.body4.regular}>기록을 선택하면, 내용을 수정할 수 있어요</p>
          </div>
          <div className={flexs({ gap: '8' })}>
            <div className={summaryStyle.timerText}>휴식 {timestampToTimerMS(restTime * 1000)}</div>
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

        <div className={summaryStyle.eventContainer}>
          <ul className={summaryStyle.eventList}>
            {quarterEvents
              .filter(evt => evt.teamType !== null && !/(^\d[SE])$/.test(evt.actionType))
              .map(event => {
                const eventId = `${event.timestamp}#${event.actionType}@${event.playListId}`;
                const { playerName, playerNo } = players?.find(p => p.playListId === event.playListId) ?? {
                  playerName: null,
                  playerNo: null,
                };

                return (
                  <li
                    key={eventId}
                    className={summaryStyle.eventCard}
                    data-selected={selected === eventId}
                    onClick={() => setSelected(eventId)}
                  >
                    <p className={flexs({ justify: 'spb' })}>
                      <span>
                        {playerNo} {playerName}
                      </span>
                      <span>{PlayingActionTypeName[event.actionType]}</span>
                    </p>
                    <p className={flexs({ justify: 'spb' })}>
                      <span>{timestampToTimerMS(event.timestamp - quarterStartTime)}</span>
                      <span>{teamName?.[event.teamType as 'home' | 'away']}</span>
                    </p>
                  </li>
                );
              })}
          </ul>
          <div className={summaryStyle.eventFormSection}>
            <div className={flexs({ dir: 'col', gap: '8', align: 'start' })}>
              <h3 className={fonts.body3.medium}>선수 변경</h3>
              <div className={summaryStyle.radioCards}>
                {players.map(player => (
                  <label htmlFor={player.playListId.toString()} className={summaryStyle.radioCard}>
                    <input type="radio" name="player" id={player.playListId.toString()} style={{ display: 'none' }} />
                    <p className={flexs({ dir: 'col', align: 'start' })}>
                      <span className={fonts.body3.medium}>
                        ({player.playerNo}) {player.playerName}
                      </span>
                      <span>{teamName?.[player.teamType]}</span>
                    </p>
                    <Icons name="check" size={16} w="bold" t="straight" />
                  </label>
                ))}
              </div>
            </div>

            <div className={flexs({ dir: 'col', gap: '4', align: 'start' })}>
              <h3 className={fonts.body3.medium}>액션 타입 변경</h3>
              <div className={summaryStyle.radioCards}>
                {Object.entries(editableActionTypes).map(([actionKey, actionValue]) => (
                  <label key={actionKey} htmlFor={actionKey} className={summaryStyle.radioCard}>
                    <input type="radio" name="actionType" id={actionKey} style={{ display: 'none' }} />
                    <span className={fonts.body3.medium}>{PlayingActionTypeName[actionValue!]}</span>
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
