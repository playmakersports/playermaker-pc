export const timestampToTimerMS = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const calculateGameTime = (
  actionTimestamp: number,
  quarterStartTimestamp: number,
  pausedEvents: Array<{ timestamp: number; type: 'start' | 'end'; quarter: number }>,
  quarter: number
) => {
  const rawElapsedTime = actionTimestamp - quarterStartTimestamp;

  // 해당 쿼터의 pause 이벤트만 필터링
  const quarterPausedEvents = pausedEvents
    .filter(event => event.quarter === quarter)
    .sort((a, b) => a.timestamp - b.timestamp);

  let totalPausedTime = 0;
  let pauseStartTime: number | null = null;

  for (const pauseEvent of quarterPausedEvents) {
    if (pauseEvent.timestamp > actionTimestamp) {
      // action이 발생한 시점 이후의 pause는 고려하지 않음
      break;
    }

    if (pauseEvent.type === 'start') {
      pauseStartTime = pauseEvent.timestamp;
    } else if (pauseEvent.type === 'end' && pauseStartTime !== null) {
      const pauseDuration = pauseEvent.timestamp - pauseStartTime;
      totalPausedTime += pauseDuration;
      pauseStartTime = null;
    }
  }

  // action이 pause 중에 발생한 경우 처리
  if (pauseStartTime !== null && pauseStartTime <= actionTimestamp) {
    // action이 pause 시작 이후에 발생했다면, pause 시작 시점까지의 시간만 계산
    return pauseStartTime - quarterStartTimestamp - totalPausedTime;
  }

  return rawElapsedTime - totalPausedTime;
};
