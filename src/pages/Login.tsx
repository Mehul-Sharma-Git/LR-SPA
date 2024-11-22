import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import { AuthLayout } from "../components/AuthLayout";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { authService } from "../lib/auth";
import type { LoginFormData } from "../types/auth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      console.log(response);
      if (
        response.SecondFactorAuthentication?.SecondFactorAuthenticationToken
      ) {
        if (
          response.SecondFactorAuthentication.OTPPhoneNo ||
          response.SecondFactorAuthentication.SecurityQuestions
        ) {
          navigate("/mfa-selector");
        } else {
          navigate("/verify-otp");
        }
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="space-y-4">
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            icon={<Lock className="h-5 w-5 text-gray-400" />}
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <button
              type="button"
              onClick={() => navigate("/otp")}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </button>
          </div>
        </div>

        <Button type="submit" isLoading={isLoading}>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
