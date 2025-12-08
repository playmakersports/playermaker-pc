import clsx from 'clsx';
import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { groupBy } from 'es-toolkit';
import { Link, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useGetMatchRoster } from '@/query/match.ts';

import { getMatchInfoDetail } from '@/apis/match.ts';
import { align, fonts } from '@/style/typo.css.ts';
import { matchDetailStyle as style } from '@/pages/admin/match/match-detail.css.ts';
import { flexRatio, flexs, fullwidth } from '@/style/container.css.ts';
import { spinner } from '@/share/components/css/ui.css.ts';
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
      <div className={style.container}>
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
      <div className={style.container}>
        <div>
          <h2 className={clsx(flexs({ justify: 'around' }))}>
            <span className={clsx(flexRatio['1'], fonts.head5.semibold, align.center)}>{homeTeam.teamName}</span>
            <div className={clsx(fonts.head5.medium, flexs({ gap: '24', align: 'start' }))}>
              <div style={{ width: '60px' }} className={align.right}>
                {homeScore || '--'}
              </div>
              <div className={flexs({ dir: 'col', gap: '8' })}>
                <p className={clsx(fonts.body2.medium)}>{status === 'BEFORE' ? '경기전' : '경기종료'}</p>
              </div>
              <div style={{ width: '60px' }} className={align.left}>
                {awayScore || '--'}
              </div>
            </div>
            <span className={clsx(flexRatio['1'], fonts.head5.semibold, align.center)}>{awayTeam.teamName}</span>
          </h2>
          <div className={style.description}>
            <p>{format(matchDate, 'M월 d일 ccc HH:mm', { locale: ko })}</p>
            {location}
          </div>
        </div>
        <div className={flexs({ gap: '24', justify: 'center' })}>
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

        <div className={flexs({ gap: '24', align: 'start' })}>
          {players &&
            Object.entries(groupBy(players, obj => obj.teamType)).map(([team, players]) => (
              <div key={team} className={clsx(fullwidth, flexs({ dir: 'col', gap: '8' }))}>
                <ul className={flexs({ dir: 'col', gap: '4', align: 'start' })}>
                  {players.map(player => (
                    <li key={player.rosterId} className={flexs({ gap: '16' })}>
                      <div className={flexs({ gap: '8' })}>
                        <span className={style.backNumber}>{player.player.number}</span>
                        <span className={fonts.body1.regular}>{player.player.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onCheck(player.player.playerId, player.rosterId, player.teamType)}
                        data-active={starter.some(s => s.playerId === player.player.playerId)}
                        className={style.starterButton}
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
