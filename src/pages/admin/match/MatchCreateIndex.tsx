import clsx from 'clsx';
import { useState } from 'react';
import { flatten } from 'es-toolkit';
import { useFieldArray, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';

import { getTeamList } from '@/apis/team.ts';
import { fonts } from '@/style/typo.css.ts';
import { matchCreateStyle as style } from '@/pages/admin/match/match.css.ts';
import Button from '@/share/components/Button.tsx';
import BaseInput from '@/share/components/inputs/BaseInput.tsx';
import DateInput from '@/share/components/inputs/DateInput.tsx';
import InputWrapper from '@/share/components/inputs/InputWrapper.tsx';
import { lib } from '@/share/libs/dialog.tsx';
import { flexs } from '@/style/container.css.ts';
import { inputStyle } from '@/share/components/css/input.css.ts';
import { PlayerListInput } from '@/pages/admin/feature/PlayerListInput.tsx';
import { postMatchInfo, postMatchQuarter } from '@/apis/match.ts';
import { spinner } from '@/share/components/css/ui.css.ts';
import CloseIcon from '@/assets/icons/common/Close20.svg?react';
import CheckIcon from '@/assets/icons/common/Check.svg?react';

interface PlayerData {
  name: string;
  number: string;
  starter: boolean;
  playerId: number;
}

interface PlayersSubmitData {
  matchId: number;
  quarter: number;
  homeTeamId: number;
  awayTeamId: number;
  homePlayers: PlayerData[];
  awayPlayers: PlayerData[];
}

interface InitialSubmitData {
  awayTeamId: number;
  date: string;
  time: string;
  location: string;
}

function MatchCreateIndex() {
  const [stage, setStage] = useState(1);
  const initialForm = useForm<any>();
  const { register, watch, control, setValue, handleSubmit } = useForm<any>({
    defaultValues: {
      homeTeamId: 1,
      homePlayers: Array(6)
        .fill(null)
        .map(() => ({ number: '', name: '', starter: false })),
      awayPlayers: Array(6)
        .fill(null)
        .map(() => ({ number: '', name: '', starter: false })),
    },
  });

  const {
    fields: homeFields,
    append: appendHome,
    remove: removeHome,
  } = useFieldArray({
    control,
    name: 'homePlayers',
  });

  const {
    fields: awayFields,
    append: appendAway,
    remove: removeAway,
  } = useFieldArray({
    control,
    name: 'awayPlayers',
  });

  const initialMutation = useMutation({
    mutationFn: postMatchInfo,
  });

  const quarterMutation = useMutation({
    mutationFn: postMatchQuarter,
  });

  const onInitialSubmit = (data: InitialSubmitData) => {
    // postMatchInfo
    initialMutation.mutate(
      {
        homeTeamId: 1,
        awayTeamId: data.awayTeamId,
        matchDateTime: `${data.date}T${data.time}`,
        location: data.location,
      },
      {
        onSuccess: async response => {
          const confirm = await lib.confirm({
            title: '경기를 생성했습니다',
            contents: '선수를 바로 등록하시겠습니까?',
          });

          if (confirm) {
            setValue('matchId', response.matchId);
            setValue('homeTeamId', response.homeTeam.teamId);
            setValue('awayTeamId', response.awayTeam.teamId);
            setValue('quarter', 1);
            setStage(2);
          }
        },
      },
    );
  };

  const onPlayersSubmit = (data: PlayersSubmitData) => {
    const homePlayers = data.homePlayers
      .map(player => ({
        playerId: player.playerId,
        teamId: data.homeTeamId,
        name: player.name,
        number: Number(player.number),
        position: null,
      }))
      .filter(player => player.name !== '');
    const awayPlayers = data.awayPlayers
      .map(player => ({
        playerId: player.playerId,
        teamId: data.awayTeamId,
        name: player.name,
        number: Number(player.number),
        position: null,
      }))
      .filter(player => player.name !== '');

    quarterMutation.mutate(
      {
        matchId: data.matchId!,
        quarter: data.quarter!,
        homeTeamId: data.homeTeamId,
        players: flatten([homePlayers, awayPlayers]).map(p => ({
          playerId: p.playerId,
          teamId: p.teamId,
          name: p.name,
          number: p.number,
          position: p.position!,
        })),
      },
      {
        onSuccess: () => {
          lib.alert({
            title: '경기 출전 선수를 설정했습니다.',
          });
        },
      },
    );
  };

  const teamInfo = [
    { type: 'home', teamId: watch('homeTeamId'), fields: homeFields, append: appendHome, remove: removeHome },
    { type: 'away', teamId: watch('awayTeamId'), fields: awayFields, append: appendAway, remove: removeAway },
  ];

  const { data: teamList } = useQuery({
    queryKey: ['getTeamList'],
    queryFn: getTeamList,
  });

  return (
    <>
      <div className={style.header}>
        <h2 className={clsx(fonts.body1.semibold)}>새 경기 만들기</h2>
        <div className={flexs({ justify: 'start' })}>
          <div className={style.stepItem} style={{ width: stage === 1 ? '560px' : '260px' }}>
            <div className={style.stepCircle} data-staged={stage >= 1}>
              {stage > 1 ? <CheckIcon width={28} height={28} /> : '1'}
            </div>
            <p>기본 정보</p>
            <div className={style.stepLine} data-active={stage === 2} />
          </div>
          <div className={style.stepItem} style={{ flex: 1 }}>
            <div className={style.stepCircle} data-staged={stage === 2}>
              2
            </div>
            <p>선수 명단</p>
            <div className={style.stepLine} />
          </div>
        </div>
      </div>
      <section className={style.formLayout}>
        <form onSubmit={initialForm.handleSubmit(onInitialSubmit as any)}>
          <aside className={style.aside} data-staged={stage === 1}>
            <InputWrapper title="상대 팀" required>
              <select
                className={clsx(fonts.body3.regular, inputStyle.innerBox)}
                {...initialForm.register('awayTeamId')}
              >
                {teamList?.map(team => (
                  <option key={team.teamId} value={team.teamId} disabled={watch('homeTeamId') === team.teamId}>
                    {team.teamName}
                  </option>
                ))}
              </select>
            </InputWrapper>
            <DateInput title="경기일" required={true} placeholder="선택해 주세요" {...initialForm.register('date')} />
            {/*<input type="time" />*/}
            <BaseInput type="text" title="경기 시간" required {...initialForm.register('time')} />
            <BaseInput type="text" title="경기 장소" {...initialForm.register('location')} />
            <Button type="submit" disabled={initialMutation.isPending}>
              {initialMutation.isPending ? (
                <div className={spinner({ theme: 'gray', size: 24, stroke: 3 })} />
              ) : (
                '만들기'
              )}
            </Button>
          </aside>
        </form>
        <form onSubmit={handleSubmit(onPlayersSubmit)}>
          <div className={style.formContent} data-staged={stage === 2}>
            {teamInfo.map(team => (
              <div key={team.type} className={flexs({ dir: 'col', gap: '16', align: 'start', justify: 'start' })}>
                <h3 className={clsx(fonts.body2.semibold, style.sectionTitle)}>{team.type.toUpperCase()} PLAYERS</h3>
                <div className={flexs({ dir: 'col', gap: '8' })}>
                  {team.fields.map((field, index) => (
                    <div key={field.id} className={clsx(flexs({ justify: 'start', gap: '12' }), style.playerRow)}>
                      <div className={style.playerNumberInput}>
                        <label className={clsx(fonts.caption1.medium, style.inputLabel)}>번호</label>
                        <input
                          className={clsx(fonts.body4.regular, inputStyle.innerBox)}
                          type="text"
                          {...register(`${team.type === 'home' ? 'homePlayers' : 'awayPlayers'}.${index}.number`, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <div className={style.playerNameInput}>
                        <label className={clsx(fonts.caption1.medium, style.inputLabel)}>선수명</label>
                        <PlayerListInput
                          teamId={team.type === 'home' ? watch('homeTeamId') : watch('awayTeamId')}
                          searchKey={watch(`${team.type === 'home' ? 'homePlayers' : 'awayPlayers'}.${index}.name`)}
                          onSubmit={player => {
                            setValue(
                              `${team.type === 'home' ? 'homePlayers' : 'awayPlayers'}.${index}.name`,
                              player.name,
                            );
                            setValue(
                              `${team.type === 'home' ? 'homePlayers' : 'awayPlayers'}.${index}.number`,
                              player.number,
                            );
                            setValue(
                              `${team.type === 'home' ? 'homePlayers' : 'awayPlayers'}.${index}.playerId`,
                              player.playerId,
                            );
                          }}
                        >
                          <input
                            autoComplete="off"
                            className={clsx(fonts.body4.regular, inputStyle.innerBox)}
                            type="text"
                            placeholder="이름을 입력해 주세요"
                            {...register(`${team.type === 'home' ? 'homePlayers' : 'awayPlayers'}.${index}.name`)}
                          />
                        </PlayerListInput>
                      </div>
                      <div className={flexs({ gap: '4' })}>
                        <div onClick={() => team.remove(index)} aria-label="선수 삭제">
                          <CloseIcon />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    theme="gray"
                    fillType="light"
                    size="small"
                    fullWidth
                    onClick={() => team.append({ number: '', name: '', starter: false })}
                  >
                    선수 추가
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button type="submit" disabled={stage === 1}>
            경기 생성
          </Button>
        </form>
      </section>
    </>
  );
}

export default MatchCreateIndex;
