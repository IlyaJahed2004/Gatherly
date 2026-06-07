import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`w-full h-[70px] bg-[#078C80] border border-black rounded-[16px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.15)] text-white font-inter font-medium text-[20px] flex items-center justify-center hover:bg-[#06756b] transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
