import { Route, Routes } from 'react-router-dom';

import Home from './Home';
import Landing from './Landing';
import NotFound from './NotFound';

function pages() {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route index path="/landing" element={<Landing />} />
      <Route index path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default pages;
