import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import { useStore } from '../../stores/rootStore';

const Navbar = observer(() => {
  const { authStore } = useStore();
  const navigate = useNavigate();

  const handleAuthClick = async () => {
    if (authStore.isLoggedIn) {
      await authStore.logout();
      navigate('/');
    } else {
      navigate('/signin');
    }
  };

  return (
    <nav
      id="main-navbar"
      className="bg-[#F3F4F6] py-8 px-8 md:px-16 flex items-center justify-between border-b border-gray-200 sticky top-0 z-50"
    >
      {/* Logo */}
      <div
        className="text-[48px] font-normal text-[#078C80] tracking-tight cursor-pointer"
        style={{ fontFamily: '"Gveret Levin", cursive' }}
        onClick={() => navigate('/')}
      >
        Gatherly
      </div>

      {/* Tabs */}
      <div className="hidden md:flex items-center gap-[40px]">
        <div className="relative flex flex-col items-center w-[240px]">
          <a href="/" className="text-[#078C80] text-[24px] font-medium pb-4">
            home
          </a>
          <div className="absolute bottom-0 w-[240px] h-[4px] bg-[#078C80]"></div>
        </div>
        <div className="relative flex flex-col items-center w-[240px]">
          <a href="/about" className="text-[#078C80] text-[24px] font-medium pb-4 hover:opacity-80 transition-opacity">
            About us
          </a>
          <div className="absolute bottom-0 w-[240px] h-[4px] bg-[#078C80] opacity-0 hover:opacity-100 transition-opacity"></div>
        </div>
      </div>

      {/* Auth Button */}
      <div>
        {authStore.isLoggedIn ? (
          <div className="flex items-center gap-4">
            <span className="text-[#078C80] text-[18px] font-medium">
              {authStore.user?.displayName}
            </span>
            <Button
              onClick={handleAuthClick}
              className="!w-auto !h-auto !py-3 !px-8 !text-[20px] !font-medium !rounded-[16px] !bg-[#078C80] hover:!bg-[#06756b] !text-[#FFFFFF] !border-none !shadow-none"
            >
              Sign out
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleAuthClick}
            className="!w-auto !h-auto !py-3 !px-8 !text-[20px] !font-medium !rounded-[16px] !bg-[#078C80] hover:!bg-[#06756b] !text-[#FFFFFF] !border-none !shadow-none"
          >
            Sign up | Sign in
          </Button>
        )}
      </div>
    </nav>
  );
});

export default Navbar;