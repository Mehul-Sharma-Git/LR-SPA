import { apiClient } from "./api-client";
import type { LoginFormData, MFAFormData, OTPFormData } from "../types/auth";

interface AuthResponse {
  secondFactorAuthentication?: {
    SecondFactorAuthenticationToken: string;
    ExpireIn: string;
    QRCode: string;
    ManualEntryCode: string;
    IsGoogleAuthenticatorVerified: boolean;
    IsAuthenticatorVerified: boolean;
    IsEmailOtpAuthenticatorVerified: boolean;
    IsOTPAuthenticatorVerified: boolean;
    OTPPhoneNo: string | null;
    OTPStatus: string | null;
    Email: string[];
    EmailOTPStatus: {
      Email: string;
    };
    IsSecurityQuestionAuthenticatorVerified: boolean;
    SecurityQuestions: {
      QuestionId: string;
      Question: string;
    }[];
  };
  profile?: any;
  access_token?: string;
  expires_in?: string;
}

interface MFAResponse {
  token: string;
  verified: boolean;
}

interface OTPResponse {
  success: boolean;
  message: string;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private loginEmail: string | null = null;
  private secondFactorAuthenticationToken: string | null = null;
  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await apiClient<AuthResponse>(
      "/identity/v2/auth/login/2fa",
      {
        method: "POST",
        body: JSON.stringify(data)
      }
    );
    console.log("res", response);

    if (
      response.data?.secondFactorAuthentication?.SecondFactorAuthenticationToken
    ) {
      this.secondFactorAuthenticationToken =
        response.data?.secondFactorAuthentication.SecondFactorAuthenticationToken;
      this.loginEmail = data.email;
    }

    return response.data!;
  }

  async verifyMFA(data: MFAFormData): Promise<MFAResponse> {
    if (!this.secondFactorAuthenticationToken)
      throw new Error("No authentication token found");

    const response = await apiClient<MFAResponse>("/auth/mfa/verify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      body: JSON.stringify(data)
    });

    return response.data!;
  }

  async requestOTP(): Promise<OTPResponse> {
    const response = await apiClient<OTPResponse>(
      `/identity/v2/auth/login/2fa/otp/email?secondfactorauthenticationtoken=${this.secondFactorAuthenticationToken}`,
      {
        method: "POST",
        body: JSON.stringify({ email: this.loginEmail })
      }
    );
    console.log(response);
    return response.data!;
  }

  async verifyOTP(code: string): Promise<AuthResponse> {
    const response = await apiClient<AuthResponse>("/auth/otp/verify", {
      method: "POST",
      body: JSON.stringify({ code })
    });

    if (response.data?.access_token) {
      this.token = response.data?.access_token;
    }

    return response.data!;
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken(): void {
    this.token = null;
  }
}

export const authService = AuthService.getInstance();
