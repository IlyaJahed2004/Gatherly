import React from 'react';
import Button from '../Button';

const Navbar = () => {
  return (
    <nav className="bg-[#F3F4F6] pt-8 pb-4 px-8 md:px-16 flex items-center justify-between border-b border-gray-200">
      {/* Logo: 48px, Regular, Gradient */}
      <div 
        className="text-[48px] font-normal bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-transparent bg-clip-text tracking-tight cursor-pointer" 
        style={{ fontFamily: '"Gveret Levin", cursive' }}
      >
        Gatherly
      </div>

      {/* Tabs: 20px, Medium */}
      <div className="hidden md:flex items-center gap-24">
        {/* Active Tab */}
        <div className="relative flex flex-col items-center">
          <a href="/" className="text-[#0D9488] text-[20px] font-medium pb-2">
            home
          </a>
          {/* Extended Underline */}
          <div className="absolute -bottom-[1px] w-[200px] h-[3px] bg-[#0D9488]"></div>
        </div>
        
        {/* Inactive Tab */}
        <a href="/about" className="text-[#0D9488] text-[20px] font-medium pb-2 hover:opacity-80 transition-opacity">
          About us
        </a>
      </div>

      {/* Auth Button: 20px, Medium */}
      <div>
        <Button className="!w-auto !h-auto !py-2 !px-6 !text-[20px] !font-medium !rounded-full !bg-[#0D9488] hover:!bg-teal-700 !text-[#FFFFFF] !border-none !shadow-none">
          Sign up | Sign in
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;