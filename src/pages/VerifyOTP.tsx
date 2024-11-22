import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { authService } from '../lib/auth';

const verifyOtpSchema = z.object({
  code: z.string().length(6, 'Code must be exactly 6 digits'),
});

type VerifyOTPFormData = z.infer<typeof verifyOtpSchema>;

export function VerifyOTP() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<VerifyOTPFormData>({
    resolver: zodResolver(verifyOtpSchema),
  });

  const onSubmit = async (data: VerifyOTPFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.verifyOTP(data.code);
      if (response.token) {
        toast.success('OTP verified successfully');
        navigate('/dashboard');
      } else {
        toast.error('Invalid OTP code');
      }
    } catch (error) {
      toast.error('Failed to verify OTP. Please try again.');
      console.error('OTP verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify OTP"
      subtitle="Enter the code sent to your email"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <Input
          label="Verification Code"
          type="text"
          autoComplete="one-time-code"
          icon={<KeyRound className="h-5 w-5 text-gray-400" />}
          error={errors.code?.message}
          {...register('code')}
        />

        <Button type="submit" isLoading={isLoading}>
          Verify Code
        </Button>

        <Button type="button" variant="secondary" onClick={() => navigate('/otp')}>
          Back
        </Button>
      </form>
    </AuthLayout>
  );
}