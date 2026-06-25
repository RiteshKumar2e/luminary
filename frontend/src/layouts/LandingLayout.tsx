import { Outlet } from 'react-router-dom';
import { LandingNavbar } from '../components/LandingNavbar';
import { Footer } from '../components/Footer';

export function LandingLayout() {
  return (
    <>
      <LandingNavbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
