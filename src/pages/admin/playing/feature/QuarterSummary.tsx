import { useEffect, useState, type ComponentProps } from 'react';
import type { OverlayControllerComponent } from 'overlay-kit';

import Button from '@/share/components/Button';
import { summaryStyle } from './css/quarter-summary.css';
import { fonts } from '@/style/typo.css';
import { flexs } from '@/style/container.css';

type Props = ComponentProps<OverlayControllerComponent> & {
  handleQuarterStart: () => void;
};
function QuarterSummary(props: Props) {
  const { isOpen, close, unmount, handleQuarterStart } = props;
  const [selected, setSelected] = useState<number | null>(null);

  const onClickQuarterStart = () => {
    handleQuarterStart();
    close();
  };

  useEffect(() => {
    if (!isOpen) {
      close();
      const timeout = setTimeout(() => {
        unmount();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return (
    <section data-open={isOpen} className={summaryStyle.container}>
      <div className={summaryStyle.inner} data-open={isOpen}>
        <div className={flexs({ justify: 'spb' })}>
          <div>
            <h2 className={fonts.body1.semibold}>쿼터종료 - 이번 쿼터 기록을 확인해 보세요</h2>
            <p className={fonts.body4.regular}>기록을 선택하면, 내용을 수정할 수 있어요</p>
          </div>
          <div className={flexs({ gap: '8' })}>
            <div className={summaryStyle.timeerText}>휴식 00:30</div>
            <Button type="button" size="medium" theme="primary" onClick={onClickQuarterStart}>
              쿼터 시작
            </Button>
          </div>
        </div>

        <div className={summaryStyle.eventContainer}>
          <ul className={summaryStyle.eventList}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(item => (
              <li
                key={item}
                className={summaryStyle.eventCard}
                data-selected={selected === item}
                onClick={() => setSelected(item)}
              >
                <p className={flexs({ justify: 'spb' })}>
                  <span>0{item}:50</span>
                  <span>어시스트</span>
                </p>
                <p className={flexs({ justify: 'spb' })}>
                  <span>3 선수명</span>
                  <span>SPABA</span>
                </p>
              </li>
            ))}
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
