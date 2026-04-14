import Button from '@/share/components/Button.tsx';
import mainCharacter from '@/assets/images/main_character.webp';

function HomeIndex() {
  return (
    <main className="flex items-center justify-center h-screen">
      <div className="flex items-center gap-3 mx-auto pt-3 pr-12 pb-0 pl-5 max-w-[960px] rounded-3xl border border-gray-200">
        <div>
          <img src={mainCharacter} alt="메인 캐릭터" width={460} />
        </div>
        <div className="flex items-start flex-col justify-center gap-4">
          <h1 className="text-2xl font-semibold">
            <span className="text-primary-600">플레이어메이커</span>와
            <br />
            경기를 운영해 보세요!
          </h1>
          <div className="w-full flex items-start flex-col justify-center gap-2">
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
