import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Fingerprint } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { authService } from '../lib/auth';
import type { MFAFormData } from '../types/auth';

const mfaSchema = z.object({
  code: z.string().length(6, 'Code must be exactly 6 digits'),
});

export function MFA() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<MFAFormData>({
    resolver: zodResolver(mfaSchema),
  });

  React.useEffect(() => {
    // Redirect if no auth token is present
    if (!authService.getToken()) {
      navigate('/login');
    }
  }, [navigate]);

  const onSubmit = async (data: MFAFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.verifyMFA(data);
      if (response.verified) {
        toast.success('MFA verification successful');
        navigate('/dashboard');
      } else {
        toast.error('Invalid MFA code');
      }
    } catch (error) {
      toast.error('MFA verification failed. Please try again.');
      console.error('MFA verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Two-Factor Authentication"
      subtitle="Enter the code from your authenticator app"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <Input
          label="Authentication Code"
          type="text"
          autoComplete="one-time-code"
          icon={<Fingerprint className="h-5 w-5 text-gray-400" />}
          error={errors.code?.message}
          {...register('code')}
        />

        <Button type="submit" isLoading={isLoading}>
          Verify
        </Button>

        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => {
            authService.clearToken();
            navigate('/login');
          }}
        >
          Back to Login
        </Button>
      </form>
    </AuthLayout>
  );
}