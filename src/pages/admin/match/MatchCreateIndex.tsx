import clsx from 'clsx';
import { fonts } from '@/style/typo.css.ts';
import { useFieldArray, useForm } from 'react-hook-form';
import Button from '@/share/components/Button.tsx';
import { matchCreateStyle as style } from '@/pages/admin/match/match.css.ts';
import BaseInput from '@/share/components/inputs/BaseInput.tsx';
import DateInput from '@/share/components/inputs/DateInput.tsx';
import { useQuery } from '@tanstack/react-query';
import { getTeamList } from '@/apis/team.ts';
import InputWrapper from '@/share/components/inputs/InputWrapper.tsx';
import { inputStyle } from '@/share/components/css/input.css.ts';
import { flexs } from '@/style/container.css.ts';
import CloseIcon from '@/assets/icons/common/Close20.svg?react';
import CheckIcon from '@/assets/icons/common/Check.svg?react';

interface Player {
  number: string;
  name: string;
  isStarter: boolean;
}

interface FormData {
  awayTeamId: string;
  date: string;
  time: string;
  place: string;
  homePlayers: Player[];
  awayPlayers: Player[];
}

function MatchCreateIndex() {
  const { register, watch, control } = useForm<FormData>({
    defaultValues: {
      homePlayers: Array(6)
        .fill(null)
        .map(() => ({ number: '', name: '', isStarter: false })),
      awayPlayers: Array(6)
        .fill(null)
        .map(() => ({ number: '', name: '', isStarter: false })),
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

  const teamInfo = [
    { type: 'home', teamId: 1, fields: homeFields, append: appendHome, remove: removeHome },
    { type: 'away', teamId: watch('awayTeamId'), fields: awayFields, append: appendAway, remove: removeAway },
  ];

  const { data: teamList } = useQuery({
    queryKey: ['getTeamList'],
    queryFn: getTeamList,
  });

  return (
    <div>
      <div className={style.header}>
        <h2 className={clsx(fonts.body1.semibold)}>새 경기 만들기</h2>
        <Button type="button">저장</Button>
      </div>
      <section className={style.formLayout}>
        <aside className={style.aside}>
          <InputWrapper title="상대 팀" required>
            <select className={clsx(fonts.body3.regular, inputStyle.innerBox)} {...register('awayTeamId')}>
              {teamList?.map(team => (
                <option key={team.teamId} value={team.teamId}>
                  {team.teamName}
                </option>
              ))}
            </select>
          </InputWrapper>
          <DateInput title="경기일" required={true} placeholder="선택해 주세요" {...register('date')} />
          {/*<input type="time" />*/}
          <BaseInput type="text" title="경기 시간" required {...register('time')} />
          <BaseInput type="text" title="경기 장소" {...register('place')} />
        </aside>

        <div className={style.formContent}>
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
                        {...register(`${team.type === 'home' ? 'homePlayers' : 'awayPlayers'}.${index}.number`)}
                      />
                    </div>
                    <div className={style.playerNameInput}>
                      <label className={clsx(fonts.caption1.medium, style.inputLabel)}>선수명</label>
                      <input
                        className={clsx(fonts.body4.regular, inputStyle.innerBox)}
                        type="text"
                        placeholder="이름을 입력해 주세요"
                        {...register(`${team.type === 'home' ? 'homePlayers' : 'awayPlayers'}.${index}.name`)}
                      />
                    </div>
                    <div className={flexs({ gap: '4' })}>
                      <label className={style.checkboxLabel}>
                        <input
                          type="checkbox"
                          style={{ position: 'absolute', left: '-9999px' }}
                          {...register(`${team.type === 'home' ? 'homePlayers' : 'awayPlayers'}.${index}.isStarter`)}
                        />
                        <CheckIcon width={20} height={20} />
                        <span>선발</span>
                      </label>
                      <div onClick={() => team.remove(index)} aria-label="선수 삭제">
                        <CloseIcon />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  mode="gray"
                  fillType="light"
                  size="small"
                  fullWidth
                  onClick={() => team.append({ number: '', name: '', isStarter: false })}
                >
                  선수 추가
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default MatchCreateIndex;
