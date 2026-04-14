import { flip, hide, offset, useDismiss, useFloating, useInteractions } from '@floating-ui/react';
import { useState } from 'react';
import clsx from 'clsx';
import { useGetMatchInfo } from '@/query/match.ts';

type Props = {
  matchId: number;
  playingIds: number[];
  teamType: 'home' | 'away';
  onSelected: (playerId: number) => void;
  children: React.ReactNode;
};
export const SubPlayerFloatingList = ({ matchId, playingIds, teamType, onSelected, children }: Props) => {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    placement: teamType === 'home' ? 'right-start' : 'left-start',
    open,
    onOpenChange: setOpen,
    middleware: [hide(), flip(), offset(8)],
  });
  const dismiss = useDismiss(context);
  const { getFloatingProps } = useInteractions([dismiss]);

  const { data } = useGetMatchInfo(matchId);

  const playerList = data?.playlists
    .filter(player => (teamType === 'home' ? player.homeYn : !player.homeYn))
    .filter(player => !playingIds.includes(player.player.playerId));

  const onClickItem = (playerId: number) => {
    onSelected(playerId);
    setOpen(false);
  };

  return (
    <div ref={refs.setReference}>
      <div style={{ height: '100%' }} onClick={() => setOpen(true)}>
        {children}
      </div>
      {open && (
        <div
          ref={refs.setFloating}
          className="py-4 px-2 shadow-xl min-w-[190px] bg-white rounded-2xl border border-info-300"
          style={{ ...floatingStyles, zIndex: 10 }}
          {...getFloatingProps()}
        >
          {playerList?.length === 0 && <span className="text-xs font-normal">조회된 선수가 없습니다.</span>}
          <div className="flex items-center flex-col gap-0.5">
            {playerList?.map(player => (
              <button
                key={player.player.playerId}
                role="button"
                className={clsx(
                  'text-xl font-medium w-full select-none cursor-pointer py-2.5 px-3 flex items-center gap-1.5 rounded-lg outline-none',
                  'hover:bg-info-50 focus:bg-info-100',
                )}
                tabIndex={0}
                onClick={() => onClickItem(player.player.playerId)}
              >
                <span className="text-lg font-semibold inline-block min-w-9 text-center text-info-600 rounded-sm bg-info-50">
                  {player.player.number}
                </span>
                {player.player.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
