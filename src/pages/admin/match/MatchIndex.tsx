import { format } from 'date-fns';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import Button from '@/share/components/Button.tsx';
import { getMatchInfoList } from '@/apis/match.ts';
import { spinner } from '@/share/components/spinner.ts';
import { useState } from 'react';
import MatchDetailSection from '@/pages/admin/match/MatchDetailSection.tsx';

function MatchIndex() {
  const [selected, setSelected] = useState<number | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ['getMatchInfoList'],
    queryFn: getMatchInfoList,
  });

  return (
    <div className="flex h-[calc(100vh-60px)]">
      <aside className="flex flex-col gap-4 p-4 pr-4 pl-0 min-w-[240px] h-full border-r border-gray-100 transition-all duration-[250ms] data-[staged=true]:min-w-[560px]">
        <Link to="/admin/match/create">
          <Button type="button" size="large" fillType="light" fullWidth={true}>
            새 경기 만들기
          </Button>
        </Link>
        <ul className="flex items-center flex-col gap-3">
          {isLoading && <div className={spinner({ theme: 'primary', size: 24, stroke: 3 })} />}
          {data?.map(item => (
            <li
              key={item.matchId}
              className="cursor-pointer select-none flex p-4 px-3 flex-col w-full border-b border-gray-100 data-[active=true]:text-primary-600 last:border-b-0"
              data-active={selected === item.matchId}
              role="button"
              onClick={() => setSelected(item.matchId)}
            >
              <p className="text-base font-medium">
                {item.homeTeam.teamName} vs {item.awayTeam.teamName}
              </p>
              <p className="text-sm font-normal">{format(item.matchDate, 'yy.MM.dd')}</p>
            </li>
          ))}
        </ul>
      </aside>
      <section className="w-full">
        <MatchDetailSection matchId={selected} />
      </section>
    </div>
  );
}

export default MatchIndex;
