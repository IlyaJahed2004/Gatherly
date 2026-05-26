// src/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />
      {/* Main Content Area */}
      <main className="px-12 py-8">
        <Outlet /> {/* This will render the current page (e.g., HomePage) */}
      </main>
    </div>
  );
};

export default MainLayout;
