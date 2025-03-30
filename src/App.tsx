import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrgProvider } from './context/org-provider';

import Layout from './layout';
import Pages from './pages/_pages';
// import Landing from './pages/Landing';

const queryClient = new QueryClient();

function App() {
  return (
    <OrgProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Layout>
            <Pages />
          </Layout>
        </BrowserRouter>
      </QueryClientProvider>
    </OrgProvider>
  );
}

export default App;
