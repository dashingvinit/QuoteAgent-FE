import { Route, Routes } from 'react-router-dom';

import Home from './Home';
import Landing from './Landing';

function pages() {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route index path="/landing" element={<Landing />} />
    </Routes>
  );
}

export default pages;
