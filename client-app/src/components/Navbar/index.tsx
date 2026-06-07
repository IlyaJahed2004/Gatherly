import React from 'react';
import Button from '../Button';

const Navbar = () => {
  return (
    <nav className="bg-[#F3F4F6] py-8 px-8 md:px-16 flex items-center justify-between border-b border-gray-200">
      {/* Logo: 48px, #078c80, Gveret Levin */}
      <div 
        className="text-[48px] font-normal text-[#078C80] tracking-tight cursor-pointer" 
        style={{ fontFamily: '"Gveret Levin", cursive' }}
      >
        Gatherly
      </div>

      {/* Tabs: 24px, Medium */}
      <div className="hidden md:flex items-center gap-24">
        {/* Active Tab */}
        <div className="relative flex flex-col items-center">
          <a href="/" className="text-[#078C80] text-[24px] font-medium pb-2">
            home
          </a>
          {/* Centered Extended Underline */}
          <div className="absolute -bottom-[1px] w-[160px] left-1/2 -translate-x-1/2 h-[3px] bg-[#078C80]"></div>
        </div>
        
        {/* Inactive Tab */}
        <a href="/about" className="text-[#078C80] text-[24px] font-medium pb-2 hover:opacity-80 transition-opacity">
          About us
        </a>
      </div>

      {/* Auth Button */}
      <div>
        <Button className="!w-auto !h-auto !py-3 !px-8 !text-[20px] !font-medium !rounded-[16px] !bg-[#078C80] hover:!bg-[#06756b] !text-[#FFFFFF] !border-none !shadow-none">
          Sign up | Sign in
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;