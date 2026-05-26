import { Mail, Lock } from 'lucide-react';
import { FaUsers } from 'react-icons/fa';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';

export default function SignIn() {
  return (
    // Main page background
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      
      {/* Main card frame (Frame 29) */}
      <div className="w-full max-w-[450px] bg-[#FFFFFF] rounded-[16px] shadow-[8px_8px_8px_0px_rgba(0,0,0,0.15)] pt-[48px] pb-[48px] px-[32px] flex flex-col gap-[32px]">
        
        {/* Logo and Title */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <FaUsers className="text-[#078C80] text-[42px]" />
            <span className="text-[#1F2937] text-[32px] font-inter font-semibold">
              Gatherly
            </span>
          </div>
          <h1 className="text-[#1F2937] text-[24px] font-inter font-medium">
            Sign in to Gatherly
          </h1>
        </div>

        {/* Form */}
        <form className="w-full flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <Input 
              type="email" 
              placeholder="Email" 
              icon={<Mail size={22} className="text-gray-400" />} 
            />
          </div>
          
          <div className="mb-8">
            <Input 
              type="password" 
              placeholder="Password" 
              icon={<Lock size={22} className="text-gray-400" />} 
            />
          </div>

          <Button className="w-full text-white font-inter font-medium text-[18px] tracking-wide rounded-[16px] py-4 bg-[#078C80] hover:bg-[#067A6F] transition-colors">
            LOGIN
          </Button>
        </form>

        {/* Bottom Section: Divider & Links */}
        <div className="w-full flex flex-col items-center gap-6">
          
          {/* Divider */}
          <div className="w-full flex items-center justify-center gap-4">
            <div className="h-[1px] bg-gray-200 flex-1"></div>
            <span className="text-gray-400 font-inter font-normal text-[20px]">or</span>
            <div className="h-[1px] bg-gray-200 flex-1"></div>
          </div>

          {/* Links Section */}
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="text-black text-[20px] font-inter font-normal">
              Forgot password?{' '}
              <a href="#" className="text-[#4F46E5] hover:underline">
                Click here
              </a>
            </div>
            
            <div className="text-black text-[20px] font-inter font-normal">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#4F46E5] hover:underline">
                Sign up
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
