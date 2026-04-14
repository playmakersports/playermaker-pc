import clsx from 'clsx';
import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { groupBy } from 'es-toolkit';
import { Link, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useGetMatchRoster } from '@/query/match.ts';

import { getMatchInfoDetail } from '@/apis/match.ts';
import { spinner } from '@/share/components/spinner.ts';
import Button from '@/share/components/Button.tsx';
import CheckIcon from '@/assets/icons/common/Check.svg?react';

type Props = {
  matchId: number | null;
};
export type PlayingStarter = {
  rosterId: number;
  playerId: number;
  teamType: 'home' | 'away';
};
const MatchDetailSection = (props: Props) => {
  const { matchId } = props;
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    enabled: !!matchId,
    queryKey: ['getMatchInfoDetail', matchId],
    queryFn: () => getMatchInfoDetail(matchId!),
  });
  const { data: players } = useGetMatchRoster(matchId!);
  const [starter, setStarter] = useState<PlayingStarter[]>([]);
  const canStart =
    starter.length === 10 && Object.values(groupBy(starter, obj => obj.teamType)).every(team => team.length === 5);

  const onCheck = (playerId: number, rosterId: number, teamType: 'home' | 'away') => {
    if (starter.some(s => s.playerId === playerId)) {
      setStarter(prev => prev.filter(s => s.playerId !== playerId));
      return;
    }
    setStarter(prev => [
      ...prev,
      {
        rosterId,
        playerId,
        teamType,
      },
    ]);
  };

  const onClickStart = () => {
    navigate(`/admin/playing/${matchId}`, { state: { starter } });
  };

  if (isLoading) {
    return (
      <div className="pt-8 px-10 flex flex-col gap-7">
        <div
          className={spinner({
            size: 28,
            theme: 'primary',
            stroke: 4,
          })}
        />
      </div>
    );
  }

  if (data) {
    const { homeTeam, awayTeam, homeScore, awayScore, status, matchDate, location } = data.recordMatchResponseDto;

    return (
      <div className="pt-8 px-10 flex flex-col gap-7">
        <div>
          <h2 className="flex items-center justify-around">
            <span className="flex-1 text-3xl font-semibold text-center">{homeTeam.teamName}</span>
            <div className="text-3xl font-medium flex items-start justify-center gap-6">
              <div style={{ width: '60px' }} className="text-right">
                {homeScore || '--'}
              </div>
              <div className="flex items-center flex-col justify-center gap-2">
                <p className="text-lg font-medium">{status === 'BEFORE' ? '경기전' : '경기종료'}</p>
              </div>
              <div style={{ width: '60px' }} className="text-left">
                {awayScore || '--'}
              </div>
            </div>
            <span className="flex-1 text-3xl font-semibold text-center">{awayTeam.teamName}</span>
          </h2>
          <div className="text-lg font-normal flex items-center flex-col justify-center gap-1 mt-4.5 text-gray-500">
            <p>{format(matchDate, 'M월 d일 ccc HH:mm', { locale: ko })}</p>
            {location}
          </div>
        </div>
        <div className="flex items-center justify-center gap-6">
          {status === 'BEFORE' && (
            <Button
              type="button"
              fillType="light"
              theme={canStart ? 'primary' : 'gray'}
              onClick={onClickStart}
              disabled={!canStart}
            >
              {canStart ? '경기 시작하기' : '선발 선수 5명씩 선택해주세요'}
            </Button>
          )}
        </div>

        <div className="flex items-start justify-center gap-6">
          {players &&
            Object.entries(groupBy(players, obj => obj.teamType)).map(([team, players]) => (
              <div key={team} className="w-full flex items-center flex-col justify-center gap-2">
                <ul className="flex items-start flex-col justify-center gap-1">
                  {players.map(player => (
                    <li key={player.rosterId} className="flex items-center justify-center gap-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-base font-semibold inline-block min-w-10 bg-gray-100 rounded-sm text-gray-700 text-center [font-feature-settings:'cv02','cv04','cv06','cv09','cv13']">
                          {player.player.number}
                        </span>
                        <span className="text-xl font-normal">{player.player.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onCheck(player.player.playerId, player.rosterId, player.teamType)}
                        data-active={starter.some(s => s.playerId === player.player.playerId)}
                        className={clsx(
                          'text-base font-semibold flex items-center justify-center gap-1 cursor-pointer py-1 px-1.5 rounded-md',
                          'data-[active=true]:bg-primary-300',
                          'data-[active=false]:text-gray-400',
                        )}
                      >
                        <CheckIcon /> 선발
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
        <Link to={`/admin/playing/${matchId}`}>경기운영</Link>
      </div>
    );
  }
  return null;
};
export default MatchDetailSection;
