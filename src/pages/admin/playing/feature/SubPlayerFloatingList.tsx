import { flip, hide, offset, useDismiss, useFloating, useInteractions } from '@floating-ui/react';
import { useState } from 'react';
import clsx from 'clsx';
import { fonts } from '@/style/typo.css.ts';
import { flexs } from '@/style/container.css.ts';
import { useGetMatchInfo } from '@/query/match.ts';
import { subListStyle } from '@/pages/admin/playing/feature/css/sub-list.css.ts';

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
          className={clsx(subListStyle.floatContainer)}
          style={{ ...floatingStyles, zIndex: 10 }}
          {...getFloatingProps()}
        >
          {playerList?.length === 0 && <span className={fonts.caption1.regular}>조회된 선수가 없습니다.</span>}
          <div className={flexs({ dir: 'col', gap: '2' })}>
            {playerList?.map(player => (
              <button
                key={player.player.playerId}
                role="button"
                className={subListStyle.listItem}
                tabIndex={0}
                onClick={() => onClickItem(player.player.playerId)}
              >
                <span className={subListStyle.backNumber}>{player.player.number}</span>
                {player.player.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
