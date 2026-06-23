import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Navbar from '../components/Navbar';
import { useStore } from '../stores/rootStore';

const MainLayout = observer(() => {
  const { authStore } = useStore();

  useEffect(() => {
    authStore.loadCurrentUser();
  }, [authStore]);

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />
      <main className="px-12 py-8">
        <Outlet />
      </main>
    </div>
  );
});

export default MainLayout;