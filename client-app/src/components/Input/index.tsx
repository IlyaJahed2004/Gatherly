import React, { type InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ icon, type, className = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={`relative flex items-center w-full h-[70px] bg-white rounded-[16px] shadow-[4px_4px_8px_0px_rgba(0,0,0,0.15)] ${className}`}>
      {/* Left Icon */}
      {icon && (
        <div className="absolute left-6 w-[24px] h-[24px] opacity-60 flex items-center justify-center text-[#1F2937]">
          {icon}
        </div>
      )}
      
      {/* Input Field */}
      <input 
        type={isPassword && showPassword ? 'text' : type}
        className={`w-full h-full bg-transparent border-none outline-none text-[#1F2937] font-inter font-medium text-[20px] placeholder:text-gray-400 ${
          icon ? 'pl-[60px]' : 'pl-6'
        } ${isPassword ? 'pr-[60px]' : 'pr-6'}`}
        {...props}
      />

      {/* Right Icon (Password Toggle) */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-6 flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
        >
          {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
        </button>
      )}
    </div>
  );
};

export default Input;
