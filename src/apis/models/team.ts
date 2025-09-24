export type GetMatchTeamResponse = Array<{
  teamId: number;
  teamName: string;
  logoUrl: string | null;
}>;

export type GetTeamPlayerResponse = {
  playerId: number;
  name: string;
  number: number;
  position: 'Guard' | string;
  recordTeam: {
    teamId: number;
    teamName: string;
    logoUrl: string;
  };
  subYn: boolean;
};
