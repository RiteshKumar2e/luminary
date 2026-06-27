import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './routes/guards';
import { AppLayout } from './layouts/AppLayout';
import { LandingLayout } from './layouts/LandingLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreativeStudio from './pages/CreativeStudio';
import StoryGenerator from './pages/StoryGenerator';
import CampaignPlanner from './pages/CampaignPlanner';
import BrandKit from './pages/BrandKit';
import AssetLibrary from './pages/AssetLibrary';
import History from './pages/History';
import Settings from './pages/Settings';
import Muse from './pages/Muse';
import PlotArchitect from './pages/PlotArchitect';
import CampaignABTester from './pages/CampaignABTester';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public landing layout */}
          <Route element={<LandingLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<Landing />} />
            <Route path="/how-it-works" element={<Landing />} />
            <Route path="/features" element={<Landing />} />
            <Route path="/contact" element={<Landing />} />
          </Route>

          {/* Auth-only (redirect if logged in) */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected app */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/muse" element={<Muse />} />
              <Route path="/studio" element={<CreativeStudio />} />
              <Route path="/story" element={<StoryGenerator />} />
              <Route path="/plot-architect" element={<PlotArchitect />} />
              <Route path="/campaign" element={<CampaignPlanner />} />
              <Route path="/campaign-tester" element={<CampaignABTester />} />
              <Route path="/brand-kit" element={<BrandKit />} />
              <Route path="/assets" element={<AssetLibrary />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
