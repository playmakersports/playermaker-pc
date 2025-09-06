import './style/reset.css';
import './style/pretendardvariable.css';
import '@/style/theme.css.ts';
import Router from './routes';
import { Provider as JotaiProvider } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { overlay } from 'overlay-kit';
import { Dialog } from '@/share/common/Dialog.tsx';

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (failureCount === 1) {
            overlay.open(controller => (
              <Dialog title="서버 통신 오류" contents={error.message} type="alert" {...controller} />
            ));
            return false;
          }
          return true;
        },
      },
    },
  });

  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </JotaiProvider>
  );
}

export default App;
