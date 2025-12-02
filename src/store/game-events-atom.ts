import { atom } from 'jotai';
import { type PlayingActionType } from '@/enums/playing.ts';

export interface GameEvent {
  rosterId: number | null;
  actionType: PlayingActionType;
  teamType: 'home' | 'away' | null;
  timestamp: number;
  quarter: number;
}

export interface PausedEvent {
  timestamp: number;
  type: 'start' | 'end';
  quarter: number;
}

export interface TimerState {
  isRunning: boolean;
  startTimestamp: number | null;
  pausedTime: number; // 누적된 일시정지 시간
}

export const gameEventsAtom = atom<GameEvent[]>([]);
export const pausedEventsAtom = atom<PausedEvent[]>([]);
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

export const popEventAtom = atom(null, (get, set, teamType: 'home' | 'away') => {
  const events = get(gameEventsAtom);
  let lastTeamEventIndex = -1;

  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i].teamType === teamType) {
      lastTeamEventIndex = i;
      break;
    }
  }

  if (lastTeamEventIndex !== -1) {
    const newEvents = [...events];
    newEvents.splice(lastTeamEventIndex, 1);
    set(gameEventsAtom, newEvents);
  }
});
