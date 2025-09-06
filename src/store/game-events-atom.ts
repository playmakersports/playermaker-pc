import { atom } from 'jotai';
import { type PlayingActionType } from '@/share/enums/playing.ts';

export interface GameEvent {
  id: string;
  playerId: number;
  actionType: PlayingActionType;
  timestamp: number;
  quarter?: number;
  teamId: 'home' | 'away';
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

export const addEventAtom = atom(null, (get, set, event: Omit<GameEvent, 'id' | 'timestamp'>) => {
  const events = get(gameEventsAtom);
  const newEvent: GameEvent = {
    ...event,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  };
  set(gameEventsAtom, [...events, newEvent]);
});
