import React from 'react';
import Button from '../Button';

const Navbar = () => {
  return (
    <nav className="bg-[#F8FAFC] py-6 px-8 md:px-16 flex items-center justify-between">
      {/* Logo */}
      <div className="text-4xl font-bold text-[#0D9488] tracking-tight cursor-pointer" style={{ fontFamily: 'cursive' }}>
        Gatherly
      </div>

      {/* Links */}
      <div className="hidden md:flex items-center gap-20">
        <a href="/" className="text-[#0D9488] font-medium border-b-2 border-[#0D9488] pb-1 px-4 text-lg">
          home
        </a>
        <a href="/about" className="text-[#0D9488] font-medium pb-1 px-4 text-lg hover:opacity-80 transition-opacity">
          About us
        </a>
      </div>

      {/* Auth Button */}
      <div>
        <Button className="!w-auto !h-auto !py-2.5 !px-6 !text-sm !font-medium !rounded-full !bg-[#0D9488] hover:!bg-teal-700 !border-none !shadow-md">
          Sign up | Sign in
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;