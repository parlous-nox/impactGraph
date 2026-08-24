import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { LandingPage } from '@/pages/LandingPage';
import { ExplorePage } from '@/pages/ExplorePage';
import { PackageDetailPage } from '@/pages/PackageDetailPage';
import { RepositoryDetailPage } from '@/pages/RepositoryDetailPage';
import { ImpactPage } from '@/pages/ImpactPage';
import { AboutPage } from '@/pages/AboutPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base-950 text-gray-200">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/packages/:packageName" element={<PackageDetailPage />} />
          <Route path="/repositories/:owner/:repo" element={<RepositoryDetailPage />} />
          <Route path="/impact/:packageName" element={<ImpactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
