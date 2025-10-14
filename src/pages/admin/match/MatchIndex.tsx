import { format } from 'date-fns';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import Button from '@/share/components/Button.tsx';
import { getMatchInfoList } from '@/apis/match.ts';
import { matchStyle as style } from '@/pages/admin/match/match.css.ts';
import { flexs, fullwidth } from '@/style/container.css.ts';
import { fonts } from '@/style/typo.css.ts';
import { useState } from 'react';
import MatchDetailSection from '@/pages/admin/match/MatchDetailSection.tsx';
import { spinner } from '@/share/components/css/ui.css.ts';

function MatchIndex() {
  const [selected, setSelected] = useState<number | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ['getMatchInfoList'],
    queryFn: getMatchInfoList,
  });

  return (
    <div className={style.container}>
      <aside className={style.aside}>
        <Link to="/admin/match/create">
          <Button type="button" size="large" fillType="light" fullWidth={true}>
            새 경기 만들기
          </Button>
        </Link>
        <ul className={flexs({ dir: 'col', gap: '12' })}>
          {isLoading && <div className={spinner({ theme: 'primary', size: 24, stroke: 3 })} />}
          {data?.map(item => (
            <li
              key={item.matchId}
              className={style.asideListItem}
              data-active={selected === item.matchId}
              role="button"
              onClick={() => setSelected(item.matchId)}
            >
              <p className={fonts.body3.medium}>
                {item.homeTeam.teamName} vs {item.awayTeam.teamName}
              </p>
              <p className={fonts.body4.regular}>{format(item.matchDate, 'yy.MM.dd')}</p>
            </li>
          ))}
        </ul>
      </aside>
      <section className={fullwidth}>
        <MatchDetailSection matchId={selected} />
      </section>
    </div>
  );
}

export default MatchIndex;
