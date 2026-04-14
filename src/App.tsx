import './style/reset.css';
import './style/components.css';
import './style/pretendardvariable.css';
import Router from './routes';
import { Provider as JotaiProvider } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { handleQueryRetry } from '@/share/libs/query-handler.ts';

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 30,
        retry: handleQueryRetry,
      },
      mutations: {
        retry: handleQueryRetry,
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
