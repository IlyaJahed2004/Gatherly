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

      {/* Tabs - فاصله (Gap) دقیقاً 100 پیکسل تنظیم شد */}
      <div className="hidden md:flex items-center gap-[100px]">
        {/* Active Tab */}
        <div className="relative flex justify-center items-center">
          {/* پدینگ پایین (pb-4) اضافه شد تا فاصله خط از متن استاندارد شود */}
          <a href="/" className="text-[#078C80] text-[24px] font-medium pb-4">
            home
          </a>
          {/* عرض خط به 120 پیکسل کاهش یافت تا دقیقاً منطبق با طرح فیگما شود */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[4px] bg-[#078C80]"></div>
        </div>
        
        {/* Inactive Tab */}
        <a href="/about" className="text-[#078C80] text-[24px] font-medium pb-4 hover:opacity-80 transition-opacity">
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