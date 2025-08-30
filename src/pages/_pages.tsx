import { Route, Routes } from 'react-router-dom';

import Landing from './Landing';
import Dashboard from './Dashboard';

import OntologyBuilderPage from './OntologyBuilder';
import PriceSheetChatPage from './PriceSheetChatPage';

import Test from './Test/index';

import NotFound from './NotFound';

function pages() {
  return (
    <Routes>
      <Route index path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ontology-builder" element={<OntologyBuilderPage />} />
      <Route path="/test" element={<Test />} />
      <Route path="/train" element={<PriceSheetChatPage />} />
      <Route path="/landing" element={<Landing />} />
      <Route index path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default pages;
