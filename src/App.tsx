import './style/reset.css';
import './style/pretendardvariable.css';
import '@/style/theme.css.ts';
import Router from './routes';
import { Provider } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <Provider>
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </Provider>
    </>
  );
}

export default App;
