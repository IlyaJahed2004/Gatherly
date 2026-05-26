import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';
import { FiMail, FiUser, FiLock } from 'react-icons/fi';
// Import the shared Input component
import Input from '../../components/Input'; 

const SignUp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Main Card Container */}
      <div className="w-full max-w-[450px] bg-white rounded-[16px] py-[48px] px-[16px] sm:px-[32px] flex flex-col items-center shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        
        {/* Header Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-[#078C80]">
            <FaUsers className="text-4xl" />
            <h1 className="text-4xl font-semibold text-[#17252A]">Gatherly</h1>
          </div>
          <h2 className="text-2xl font-medium text-[#17252A]">
            Create your Account
          </h2>
        </div>

        {/* Inputs Section */}
        <div className="w-full flex flex-col gap-[32px] mt-[40px] mb-[36px]">
          <Input 
            type="email" 
            placeholder="Email" 
            icon={<FiMail className="text-xl" />} 
          />
          <Input 
            type="text" 
            placeholder="Display Name" 
            icon={<FiUser className="text-xl" />} 
          />
          <Input 
            type="password" 
            placeholder="Password" 
            icon={<FiLock className="text-xl" />} 
          />
        </div>

        {/* Submit Button */}
        <button className="w-full h-[72px] bg-[#078C80] text-white rounded-[16px] text-[20px] font-medium shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:bg-[#067A6F] transition-colors">
          REGISTER
        </button>

        {/* Footer Link */}
        <div className="text-[20px] text-[#17252A] mt-[32px]">
          Already have an account?{' '}
          <Link to="/signin" className="text-[#4F46E5] hover:text-[#3b2ddb] transition-colors">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SignUp;
