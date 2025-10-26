import Button from '@/share/components/Button.tsx';
import mainCharacter from '@/assets/images/main_character.webp';
import { mainStyle } from '@/pages/home/main.css.ts';
import { fonts } from '@/style/typo.css.ts';
import { flexs, fullwidth } from '@/style/container.css.ts';
import { theme } from '@/style/theme.css.ts';
import clsx from 'clsx';

function HomeIndex() {
  return (
    <main className={mainStyle.container}>
      <div className={mainStyle.box}>
        <div>
          <img src={mainCharacter} alt="메인 캐릭터" width={460} />
        </div>
        <div className={flexs({ dir: 'col', align: 'start', gap: '16' })}>
          <h1 className={fonts.head6.semibold}>
            <span style={{ color: theme.color.primary['600'] }}>플레이어메이커</span>와
            <br />
            경기를 운영해 보세요!
          </h1>
          <div className={clsx(fullwidth, flexs({ dir: 'col', align: 'start', gap: '8' }))}>
            <Button type="button" theme="gray" fillType="outline" size="xlarge" fullWidth>
              구글 로그인
            </Button>
            <Button type="button" theme="gray" fillType="outline" size="xlarge" fullWidth>
              카카오 로그인
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default HomeIndex;
