import { atom } from 'jotai';
import { type PlayingActionType } from '@/enums/playing.ts';

export interface GameEvent {
  playerId: number | null;
  actionType: PlayingActionType;
  teamType: 'home' | 'away' | null;
  timestamp: number;
}

export interface TimerState {
  isRunning: boolean;
  startTimestamp: number | null;
  pausedTime: number; // 누적된 일시정지 시간
}

export const gameEventsAtom = atom<GameEvent[]>([]);
export const timerAtom = atom<TimerState>({
  isRunning: false,
  startTimestamp: null,
  pausedTime: 0,
});

export const addEventAtom = atom(null, (get, set, event: Omit<GameEvent, 'timestamp'>) => {
  const events = get(gameEventsAtom);
  const newEvent: GameEvent = {
    ...event,
    timestamp: Date.now(),
  };
  set(gameEventsAtom, [...events, newEvent]);
});
