import { useQuery } from '@tanstack/react-query';
import { getMatchInfoDetail } from '@/apis/match.ts';

export const useGetMatchInfo = (matchId: number) =>
  useQuery({
    enabled: !!matchId,
    queryKey: ['getMatchInfoDetail', matchId],
    queryFn: () => getMatchInfoDetail(matchId!),
  });
