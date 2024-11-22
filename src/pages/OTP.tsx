import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import { AuthLayout } from "../components/AuthLayout";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { authService } from "../lib/auth";
import type { OTPFormData } from "../types/auth";

const otpSchema = z.object({
  email: z.string().email("Invalid email address")
});

export function OTP() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema)
  });

  const onSubmit = async (data: OTPFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.requestOTP();
      if (response.success) {
        toast.success(response.message || "OTP sent successfully");
        navigate("/verify-otp");
      } else {
        toast.error(response.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
      console.error("OTP sending failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="One-Time Password"
      subtitle="Enter your email to receive a one-time password"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          icon={<Mail className="h-5 w-5 text-gray-400" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Button type="submit" isLoading={isLoading}>
          Send OTP
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </Button>
      </form>
    </AuthLayout>
  );
}
