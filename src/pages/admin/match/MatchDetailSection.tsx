import clsx from 'clsx';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { groupBy } from 'es-toolkit';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { getMatchInfoDetail } from '@/apis/match.ts';
import { align, fonts } from '@/style/typo.css.ts';
import { matchDetailStyle as style } from '@/pages/admin/match/match-detail.css.ts';
import { flexRatio, flexs, fullwidth } from '@/style/container.css.ts';
import { spinner } from '@/share/components/css/ui.css.ts';
import Button from '@/share/components/Button.tsx';

type Props = {
  matchId: number | null;
};
const MatchDetailSection = (props: Props) => {
  const { matchId } = props;
  const { data, isLoading } = useQuery({
    enabled: !!matchId,
    queryKey: ['getMatchInfoDetail', matchId],
    queryFn: () => getMatchInfoDetail(matchId!),
  });

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
    const playerList = groupBy(data.playlists, player => (player.homeYn ? 'home' : 'away'));

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
                {status === 'BEFORE' && (
                  <Link to={`/admin/playing/${matchId}`}>
                    <Button type="button" fillType="light" theme="gray">
                      경기 시작하기
                    </Button>
                  </Link>
                )}
              </div>
              <div style={{ width: '60px' }} className={align.left}>
                {awayScore || '--'}
              </div>
            </div>
            <span className={clsx(flexRatio['1'], fonts.head5.semibold, align.center)}>{awayTeam.teamName}</span>
          </h2>
          <div className={style.description}>
            <p>
              {format(matchDate, 'yyyy년 M월 d일 (ccc) a hh:mm', {
                locale: ko,
              })}
              , {location}
            </p>
          </div>
        </div>
        <div className={flexs({ gap: '24', align: 'start' })}>
          {Object.entries(playerList).map(([team, players]) => (
            <div key={team} className={clsx(fullwidth, flexs({ dir: 'col', gap: '8' }))}>
              <p className={fonts.head5.semibold}>{team}</p>
              <ul className={flexs({ dir: 'col', gap: '4', align: 'start' })}>
                {players.map(player => (
                  <li key={player.playListId} className={flexs({ gap: '16' })}>
                    <div className={flexs({ gap: '8' })}>
                      <span className={style.backNumber}>{player.player.number}</span>
                      <span className={fonts.body1.regular}>{player.player.name}</span>
                    </div>
                    <span className={fonts.body3.semibold}> {player.starter ? '선발' : ''}</span>
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
