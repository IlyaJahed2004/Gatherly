import { Mail, User, Lock } from 'lucide-react';
import { FaUsers } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useStore } from '../../stores/rootStore';

interface SignUpForm {
  email: string;
  displayName: string;
  password: string;
}

function SignUp() {
  const { authStore } = useStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>();

  const onSubmit = async (data: SignUpForm) => {
    try {
      await authStore.register(data);
      navigate('/signin');
    } catch {
    }
  };


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
        <form
          className="w-full flex flex-col gap-[24px]"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {authStore.error && (
            <p className="text-red-500 text-[14px] font-inter text-center -mb-2">
              {authStore.error.message}
            </p>
          )}
          <Input
            type="email"
            placeholder="Email"
            icon={<Mail size={22} className="text-gray-400" />}
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />
          <Input
            type="text"
            placeholder="Display Name"
            icon={<User size={22} className="text-gray-400" />}
            error={errors.displayName?.message}
            {...register('displayName', {
              required: 'Display name is required',
              minLength: {
                value: 3,
                message: 'Display name must be at least 3 characters',
              },
            })}
          />
          <Input
            type="password"
            placeholder="Password"
            icon={<Lock size={22} className="text-gray-400" />}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
              validate: {
                hasUpper: (v) => /[A-Z]/.test(v) || 'Password must contain an uppercase letter',
                hasLower: (v) => /[a-z]/.test(v) || 'Password must contain a lowercase letter',
                hasDigit: (v) => /[0-9]/.test(v) || 'Password must contain a digit',
                hasSpecial: (v) => /[^A-Za-z0-9]/.test(v) || 'Password must contain a special character',
              },
            })}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white font-inter font-medium text-[18px] tracking-wide rounded-[16px] py-4 bg-[#078C80] hover:bg-[#067A6F] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'REGISTERING...' : 'REGISTER'}
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

export default observer(SignUp);
