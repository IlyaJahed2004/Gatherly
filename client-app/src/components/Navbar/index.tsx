import React from 'react';
import Button from '../Button';

const Navbar = () => {
  return (
    <nav className="bg-[#F3F4F6] py-8 px-8 md:px-16 flex items-center justify-between border-b border-gray-200">
      {/* Logo */}
      <div 
        className="text-[48px] font-normal text-[#078C80] tracking-tight cursor-pointer" 
        style={{ fontFamily: '"Gveret Levin", cursive' }}
      >
        Gatherly
      </div>

      {/* Tabs - فاصله بین تب‌ها */}
      <div className="hidden md:flex items-center gap-[100px]">
        
        {/* Active Tab */}
        {/* ترفند جادویی: استفاده از after: برای ساختن خطی که کاملاً مستقل از کادر کلمه است */}
        <a 
          href="/" 
          className="relative text-[#078C80] text-[24px] font-medium pb-2
          after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-[150px] after:h-[4px] after:bg-[#078C80]"
        >
          home
        </a>
        
        {/* Inactive Tab */}
        <a 
          href="/about" 
          className="relative text-[#078C80] text-[24px] font-medium pb-2 hover:opacity-80 transition-opacity"
        >
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