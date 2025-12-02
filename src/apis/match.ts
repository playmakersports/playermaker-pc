import { http, isHttpError } from '@/utils/http.ts';
import type {
  MatchInfoDetailResponse,
  MatchInfoResponse,
  MatchRosterResponseItem,
  PostMatchInfoRequest,
  PostMatchQuarterRequest,
} from '@/apis/models/match.ts';
import type { GameEvent } from '@/store/game-events-atom.ts';

export const postMatchInfo = async (request: PostMatchInfoRequest) => {
  try {
    return await http.post<MatchInfoResponse>('/api/match/info', { json: request });
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};
export const postMatchQuarter = async (request: PostMatchQuarterRequest) => {
  try {
    return await http.post('/api/match/interaction/sQuarter', { json: request });
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};
export const getMatchRoster = async (matchId: number) => {
  try {
    return await http.get<MatchRosterResponseItem[]>('/api/match/interaction/roster', {
      searchParams: {
        matchId,
      },
    });
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const getMatchInfoList = async () => {
  try {
    return await http.get<MatchInfoResponse[]>('/api/match/info');
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};
export const getMatchInfoDetail = async (matchId: number) => {
  try {
    return await http.get<MatchInfoDetailResponse>(`/api/match/info/detail?matchId=${matchId}`);
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const postMatchStatAdd = async (request: GameEvent[]) => {
  try {
    return await http.post<MatchInfoDetailResponse>(`/api/match/stat`, { json: request });
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};
