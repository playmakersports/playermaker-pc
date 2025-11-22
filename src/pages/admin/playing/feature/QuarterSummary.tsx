import { type ComponentProps, useState } from 'react';
import type { OverlayControllerComponent } from 'overlay-kit';

import Button from '@/share/components/Button';
import { summaryStyle } from './css/quarter-summary.css';
import { fonts } from '@/style/typo.css';
import { flexs } from '@/style/container.css';
import { useAtom } from 'jotai/index';
import { gameEventsAtom } from '@/store/game-events-atom.ts';
import { useMutation } from '@tanstack/react-query';
import { postMatchStatAdd } from '@/apis/match.ts';
import { PlayingActionTypeName } from '@/pages/admin/playing/feature/RecentActionTable.tsx';

type Props = ComponentProps<OverlayControllerComponent> & {
  quarter: number;
  handleQuarterStart: () => void;
};
function QuarterSummary(props: Props) {
  const { isOpen, close, unmount, quarter, handleQuarterStart } = props;
  const [selected, setSelected] = useState<string | null>(null);

  const [gameEvents] = useAtom(gameEventsAtom);
  const quarterEvents = gameEvents.filter(event => event.quarter === quarter);
  const isFourthQuarter = gameEvents.slice(-1)[0].actionType === '4E';

  const { mutate } = useMutation({
    mutationFn: postMatchStatAdd,
  });

  const onClickQuarterStart = () => {
    handleQuarterStart();
    close();
    setTimeout(() => unmount(), 300);
  };
  const onClickEndSubmit = () => {
    mutate(
      gameEvents.filter(event => !!event.playListId),
      {
        onSuccess: () => {
          close();
          setTimeout(() => unmount(), 300);
        },
      },
    );
  };

  return (
    <section data-open={isOpen} className={summaryStyle.container}>
      <div className={summaryStyle.inner} data-open={isOpen}>
        <div className={flexs({ justify: 'spb' })}>
          <div>
            <h2 className={fonts.body1.semibold}>{quarter}쿼터 종료: 기록을 확인해 보세요</h2>
            <p className={fonts.body4.regular}>기록을 선택하면, 내용을 수정할 수 있어요</p>
          </div>
          <div className={flexs({ gap: '8' })}>
            <div className={summaryStyle.timeerText}>휴식 00:30</div>
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
            {quarterEvents.map(event => {
              const eventId = `${event.timestamp}#${event.actionType}`;
              return (
                <li
                  key={eventId}
                  className={summaryStyle.eventCard}
                  data-selected={selected === eventId}
                  onClick={() => setSelected(eventId)}
                >
                  <p className={flexs({ justify: 'spb' })}>
                    <span>{event.timestamp}</span>
                    <span>{PlayingActionTypeName[event.actionType]}</span>
                  </p>
                  <p className={flexs({ justify: 'spb' })}>
                    <span>3 {event.teamType}</span>
                    <span>SPABA</span>
                  </p>
                </li>
              );
            })}
          </ul>
          <div className={summaryStyle.eventFormSection}>
            <p>데이터의 정확성을 위해 시간 수정은 제한하고 있어요</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuarterSummary;
