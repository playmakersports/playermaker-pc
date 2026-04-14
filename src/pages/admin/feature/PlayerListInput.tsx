import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { convertHangulToQwerty } from 'es-hangul';
import { flip, hide, offset, useDismiss, useFloating, useInteractions } from '@floating-ui/react';

import { getTeamPlayerList } from '@/apis/team.ts';

type PlayerInfo = {
  name: string;
  playerId: number;
  number: number;
};
type Props = {
  children: React.ReactNode;
  teamId: number;
  searchKey: string;
  onSubmit: (player: PlayerInfo) => void;
};

export const PlayerListInput = (props: Props) => {
  const { children, teamId, searchKey, onSubmit } = props;
  const childrenRef = useRef<HTMLDivElement>(null);
  const optionsRefs = useRef<HTMLButtonElement[]>([]);

  const [open, setOpen] = useState(false);
  const { data } = useQuery({
    enabled: !!teamId,
    queryKey: ['getTeamPlayerList', teamId],
    queryFn: () => getTeamPlayerList(teamId),
  });

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open,
    onOpenChange: setOpen,
    middleware: [hide(), flip(), offset(8)],
  });
  const dismiss = useDismiss(context);
  const { getFloatingProps } = useInteractions([dismiss]);

  const filterSearchResult = data?.filter(player => {
    return convertHangulToQwerty(player.name).includes(convertHangulToQwerty(searchKey));
  });

  const currentList = searchKey ? filterSearchResult : data;

  const onClickItem = (player: PlayerInfo) => {
    onSubmit(player);
    setOpen(false);
  };

  const onKeyupOptionSelect = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextOption = optionsRefs.current[index + 1];
      nextOption?.focus({ preventScroll: true });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevOption = optionsRefs.current[index - 1];
      prevOption?.focus({ preventScroll: true });
    }
  };

  useEffect(() => {
    const childrenInputRef = childrenRef.current?.childNodes[0] as HTMLInputElement;
    if (!childrenInputRef) return;

    const handleFocus = () => setOpen(true);

    const handleBlur = (e: FocusEvent) => {
      const relatedTarget = e.relatedTarget as Element;
      const floatingElement = refs.floating.current;

      if (!relatedTarget || !floatingElement?.contains(relatedTarget)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open || !currentList?.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextOption = optionsRefs.current[0];
        nextOption.focus();
      } else if (e.key === 'Escape') {
        setOpen(false);
        childrenInputRef.focus();
      }
    };

    childrenInputRef.addEventListener('focus', handleFocus);
    childrenInputRef.addEventListener('blur', handleBlur);
    childrenInputRef.addEventListener('keydown', handleKeyDown);

    return () => {
      childrenInputRef.removeEventListener('focus', handleFocus);
      childrenInputRef.removeEventListener('blur', handleBlur);
      childrenInputRef.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, currentList, refs.floating]);

  return (
    <div ref={refs.setReference}>
      <div ref={childrenRef}>{children}</div>
      {open && (
        <div
          ref={refs.setFloating}
          className="py-4 px-2 rounded-3xl bg-white shadow-xl min-w-[190px]"
          style={{ ...floatingStyles, zIndex: 10 }}
          {...getFloatingProps()}
        >
          {data?.length === 0 && <span className="text-xs font-normal">조회된 선수가 없습니다.</span>}
          <div className="flex items-center flex-col gap-0.5">
            {currentList?.map((player, index) => (
              <button
                key={player.playerId}
                role="button"
                className={clsx(
                  'text-lg font-normal w-full select-none cursor-pointer py-1.5 px-3 flex items-center gap-1.5 rounded-2xl outline-none',
                  'hover:bg-primary-50 focus:bg-primary-100',
                )}
                tabIndex={0}
                onKeyUp={e => onKeyupOptionSelect(e, index)}
                onClick={() => onClickItem({ number: player.number, name: player.name, playerId: player.playerId })}
                ref={element => {
                  if (element) {
                    optionsRefs.current[index] = element as HTMLButtonElement;
                  }
                }}
              >
                <span className="text-xs font-medium inline-block w-6 text-center bg-primary-500 text-white rounded-sm">
                  {player.number}
                </span>
                {player.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
