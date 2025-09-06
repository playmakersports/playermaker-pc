import { matchStyle as style } from '@/pages/admin/match/match.css.ts';
import Button from '@/share/components/Button.tsx';
import { Link } from 'react-router';

function MatchIndex() {
  return (
    <div className={style.container}>
      <aside className={style.aside}>
        <Link to="/admin/match/create">
          <Button type="button" size="large" fillType="light" fullWidth={true}>
            새 경기 만들기
          </Button>
        </Link>
        <ul>우리 팀 경기가 없어요</ul>
      </aside>
      <section>내용</section>
    </div>
  );
}

export default MatchIndex;
