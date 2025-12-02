import { useQuery } from '@tanstack/react-query';
import { getMatchInfoDetail, getMatchRoster } from '@/apis/match.ts';

export const useGetMatchInfo = (matchId: number) =>
  useQuery({
    enabled: !!matchId,
    queryKey: ['getMatchInfoDetail', matchId],
    queryFn: () => getMatchInfoDetail(matchId!),
  });

export const useGetMatchRoster = (matchId: number) =>
  useQuery({
    enabled: !!matchId,
    queryKey: ['getMatchRoster', matchId],
    queryFn: () => getMatchRoster(matchId!),
  });
