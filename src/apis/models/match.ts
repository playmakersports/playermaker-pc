import type { GetTeamPlayerResponse } from '@/apis/models/team.ts';

export type PostMatchInfoRequest = {
  homeTeamId: number;
  awayTeamId: number;
  matchDateTime: string;
  location: string;
};
type MatchPlayerRequest = {
  playerId: number;
  teamId: number;
  name: string;
  number: number;
  position: string;
};
export type PostMatchQuarterRequest = {
  players: MatchPlayerRequest[];
  matchId: number;
  quarter: number;
  homeTeamId: number;
};

export type MatchInfoResponse = {
  matchId: number;
  homeTeam: {
    teamId: number;
    teamName: string;
    logoUrl: string;
  };
  awayTeam: {
    teamId: number;
    teamName: string;
    logoUrl: string;
  };
  homeScore: number | null;
  awayScore: number | null;
  status: 'BEFORE' | 'AFTER';
  matchDate: string; // 2025-09-02T04:00:00.000Z
  location: string;
};

export type MatchRosterResponseItem = {
  rosterId: number;
  player: {
    name: string;
    number: number;
    playerId: number;
    position: string | null;
    recordTeam: {
      teamId: number;
      teamName: string;
      logoUrl: string | null;
    };
  };
  teamType: 'home' | 'away';
};

export type MatchInfoDetailResponse = {
  recordMatchResponseDto: {
    matchId: number;
    homeTeam: {
      teamId: number;
      teamName: string;
      logoUrl: string | null;
    };
    awayTeam: {
      teamId: number;
      teamName: string;
      logoUrl: string | null;
    };
    homeScore: number | null;
    awayScore: number | null;
    status: 'BEFORE' | 'AFTER';
    matchDate: string;
    location: string;
  };
  playlists: {
    homeYn: boolean;
    playListId: number;
    player: GetTeamPlayerResponse;
    starter: boolean;
  }[];
};
