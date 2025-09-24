import { http, isHttpError } from '@/utils/http.ts';
import type { GetMatchTeamResponse, GetTeamPlayerResponse } from '@/apis/models/team.ts';

export const getTeamList = async () => {
  try {
    return await http.get<GetMatchTeamResponse>('/api/match/teams');
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const getTeamPlayerList = async (teamId: number) => {
  try {
    return await http.get<GetTeamPlayerResponse[]>('/api/match/player?teamId=' + teamId);
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};
