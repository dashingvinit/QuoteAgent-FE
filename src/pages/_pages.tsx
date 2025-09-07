import { Route, Routes } from 'react-router-dom';

import Landing from './Landing';
import Dashboard from './Dashboard';

import OntologyBuilderPage from './OntologyBuilder';

import PriceSheetChatPage from './PriceSheetChatPage';
import BrowseAllComponents from './BrowseAllComponents';
import UpdateVectors from './UpdateVectors';

import OrganizationEditPage from './Organization';
import Test from './Test/index';

import NotFound from './NotFound';

function pages() {
  return (
    <Routes>
      <Route path="/landing" element={<Landing />} />

      <Route index path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ontology" element={<OntologyBuilderPage />} />

      <Route path="/components" element={<BrowseAllComponents />} />
      <Route path="/components/upload" element={<PriceSheetChatPage />} />
      <Route path="/components/relations" element={<UpdateVectors />} />

      <Route path="/quotes/generate" element={<Test />} />

      <Route path="/Settings" element={<OrganizationEditPage />} />

      <Route index path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default pages;
