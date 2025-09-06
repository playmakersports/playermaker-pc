import { http, isHttpError } from '@/utils/http.ts';
import type { GetMatchTeamResponse } from '@/apis/models/team.ts';

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
