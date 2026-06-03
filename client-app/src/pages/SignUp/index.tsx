import { Mail, User, Lock } from 'lucide-react';
import { FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-[450px] bg-white rounded-[16px] shadow-[8px_8px_8px_0px_rgba(0,0,0,0.15)] pt-[48px] pb-[48px] px-[32px] flex flex-col gap-[32px]">

        {/* Logo and Title */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <FaUsers className="text-[#078C80] text-[42px]" />
            <span className="text-[#1F2937] text-[32px] font-inter font-semibold">
              Gatherly
            </span>
          </div>
          <h1 className="text-[#1F2937] text-[24px] font-inter font-medium">
            Create your Account
          </h1>
        </div>

        {/* Form */}
        <form className="w-full flex flex-col gap-[24px]" onSubmit={(e) => e.preventDefault()}>
          <Input
            type="email"
            placeholder="Email"
            icon={<Mail size={22} className="text-gray-400" />}
          />
          <Input
            type="text"
            placeholder="Display Name"
            icon={<User size={22} className="text-gray-400" />}
          />
          <Input
            type="password"
            placeholder="Password"
            icon={<Lock size={22} className="text-gray-400" />}
          />
          <Button className="w-full text-white font-inter font-medium text-[18px] tracking-wide rounded-[16px] py-4 bg-[#078C80] hover:bg-[#067A6F] transition-colors">
            REGISTER
          </Button>
        </form>

        {/* Bottom Section: Link */}
        <div className="w-full flex flex-col items-center gap-3">
          <div className="text-[#1F2937] text-[20px] font-inter font-normal">
            Already have an account?{' '}
            <Link to="/signin" className="text-[#4F46E5] hover:underline">
              Sign in
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
