import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Layout from './layout/Layout';
import Pages from './pages/_pages';
// import Landing from './pages/Landing';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Layout>
            <Pages />
          </Layout>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
