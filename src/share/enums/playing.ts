export const PlayingActionEnums = {
  POINT1: '1',
  POINT2: '2',
  POINT3: '3',
  ASSIST: 'A',
  BLOCK: 'B',
  STEAL: 'S',
  TURNOVER: 'T',
  ATTACK_REBOUND: 'AB',
  DEFENCE_REBOUND: 'DB',
  P_FOUL: 'PF',
  OF_FOUL: 'OF',
  TF_FOUL: 'TF',
  PLAYER_IN: 'IN',
  PLAYER_OUT: 'OUT',
} as const;

export type PlayingActionType = (typeof PlayingActionEnums)[keyof typeof PlayingActionEnums];
