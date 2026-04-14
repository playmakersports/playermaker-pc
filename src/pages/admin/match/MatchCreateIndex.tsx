import clsx from 'clsx';
import { useState } from 'react';
import { flatten } from 'es-toolkit';
import { useFieldArray, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';

import { getTeamList } from '@/apis/team.ts';
import Button from '@/share/components/Button.tsx';
import BaseInput from '@/share/components/inputs/BaseInput.tsx';
import DateInput from '@/share/components/inputs/DateInput.tsx';
import InputWrapper from '@/share/components/inputs/InputWrapper.tsx';
import { lib } from '@/share/libs/dialog.tsx';
import { PlayerListInput } from '@/pages/admin/feature/PlayerListInput.tsx';
import { postMatchInfo, postMatchQuarter } from '@/apis/match.ts';
import { spinner } from '@/share/components/spinner.ts';
import CloseIcon from '@/assets/icons/common/Close20.svg?react';

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

const innerBoxClass =
  'input-inner-box relative flex items-center w-full h-10 px-3 gap-2 rounded-lg border border-gray-200';

function MatchCreateIndex() {
  const [stage, setStage] = useState(1);
  const initialForm = useForm<InitialSubmitData>();
  const {
    formState: { errors, isValid },
  } = initialForm;
  console.log(errors);
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
      <div className="my-4">
        <h2 className="text-xl font-semibold">새 경기 만들기</h2>
      </div>
      <section className="flex gap-4 h-full">
        <form onSubmit={initialForm.handleSubmit(onInitialSubmit)}>
          <aside
            className="flex flex-col gap-4 p-4 pr-4 pl-0 min-w-[240px] h-full border-r border-gray-100 transition-all duration-[250ms] data-[staged=true]:min-w-[560px]"
            data-staged={stage === 1}
          >
            <InputWrapper title="상대 팀" required>
              <select
                disabled={stage === 2}
                className={clsx('text-base font-normal', innerBoxClass)}
                {...initialForm.register('awayTeamId', {
                  required: { message: '상대 팀을 선택해 주세요', value: true },
                })}
              >
                {teamList?.map(team => (
                  <option key={team.teamId} value={team.teamId} disabled={watch('homeTeamId') === team.teamId}>
                    {team.teamName}
                  </option>
                ))}
              </select>
            </InputWrapper>
            <DateInput
              disabled={stage === 2}
              title="경기일"
              placeholder="선택해 주세요"
              {...initialForm.register('date', {
                required: { message: '경기일을 선택해 주세요', value: true },
              })}
            />
            <BaseInput
              disabled={stage === 2}
              type="text"
              title="경기 시간"
              placeholder="HH:MM 형식으로 입력"
              {...initialForm.register('time', {
                required: { message: '경기 시간을 입력해 주세요', value: true },
                validate: value => /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(value),
              })}
            />
            <BaseInput type="text" title="경기 장소" disabled={stage === 2} {...initialForm.register('location')} />

            <div className="text-base font-normal">
              {Object.values(errors).map(err => (
                <p key={err.message}>{err?.message}</p>
              ))}
            </div>

            <Button type="submit" size="large" disabled={initialMutation.isPending || !isValid || stage === 2}>
              {initialMutation.isPending ? (
                <div className={spinner({ theme: 'gray', size: 24, stroke: 3 })} />
              ) : (
                '만들기'
              )}
            </Button>
          </aside>
        </form>
        <form onSubmit={handleSubmit(onPlayersSubmit)}>
          <div
            className="form-content relative flex-1 py-4 flex justify-around gap-5"
            data-staged={stage === 2}
          >
            {teamInfo.map(team => (
              <div key={team.type} className="flex items-start flex-col justify-start gap-4">
                <h3 className="text-lg font-semibold mb-4">{team.type.toUpperCase()} PLAYERS</h3>
                <div className="flex items-center flex-col justify-center gap-2">
                  {team.fields.map((field, index) => (
                    <div key={field.id} className="flex items-end justify-start gap-3">
                      <div className="w-[60px]">
                        <label className="text-xs font-medium block mb-1">번호</label>
                        <input
                          className={clsx('text-sm font-normal', innerBoxClass)}
                          type="text"
                          {...register(`${team.type === 'home' ? 'homePlayers' : 'awayPlayers'}.${index}.number`, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <div className="w-[152px]">
                        <label className="text-xs font-medium block mb-1">선수명</label>
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
                            className={clsx('text-sm font-normal', innerBoxClass)}
                            type="text"
                            placeholder="이름을 입력해 주세요"
                            {...register(`${team.type === 'home' ? 'homePlayers' : 'awayPlayers'}.${index}.name`)}
                          />
                        </PlayerListInput>
                      </div>
                      <div className="flex items-center justify-center gap-1">
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
          <Button type="submit" size="large" disabled={stage === 1}>
            선수 명단 저장
          </Button>
        </form>
      </section>
    </>
  );
}

export default MatchCreateIndex;
