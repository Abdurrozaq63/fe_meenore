import { Routes, Route } from 'react-router-dom';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import Archives from './pages/Archives';
import Record from './pages/Record';
import Detail from './pages/Detail';
import Favourite from './pages/Favourite';
import Tags from './pages/Tags';
import TagDetail from './pages/TagDetail';
import Profile from './pages/Profile';

import ProtectedRoute from './auth/routes/ProtectedRoute';
import PublicOnlyRoute from './auth/routes/PublicOnlyRoute';
import LandingPage from './pages/LandingPage';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="" element={<LandingPage />} />

      {/* Only guests */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/sign-in" element={<SignIn />} />

        <Route path="/sign-up" element={<SignUp />} />
      </Route>

      {/* Only authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/archives" element={<Archives />} />

        <Route path="/record" element={<Record />} />

        <Route path="/detail/:id" element={<Detail />} />

        <Route path="/favourite" element={<Favourite />} />

        <Route path="/tags" element={<Tags />} />

        <Route path="/tags/:id" element={<TagDetail />} />

        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
