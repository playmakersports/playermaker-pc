import Button from '@/share/components/Button.tsx';

function HomeIndex() {
  return (
    <main>
      <div></div>
      <div>
        <Button type="button" mode="gray" fillType="outline" size="xlarge">
          구글 로그인
        </Button>
        <Button type="button" mode="gray" fillType="outline" size="xlarge">
          카카오 로그인
        </Button>
      </div>
    </main>
  );
}

export default HomeIndex;
