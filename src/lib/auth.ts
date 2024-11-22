import { apiClient } from "./api-client";
import type { LoginFormData, MFAFormData, OTPFormData } from "../types/auth";

interface AuthResponse {
  SecondFactorAuthentication?: {
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
  Profile?: any;
  access_token?: string;
  expires_in?: string;
}

interface MFAResponse {
  token: string;
  verified: boolean;
}
interface OTPVerifyResponse {
  access_token: string;
}
interface OTPResponse {
  IsPosted: boolean;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = localStorage.getItem("spa-token") || null;
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
    try {
      const response = await apiClient<AuthResponse>(
        "/identity/v2/auth/login/2fa",
        {
          method: "POST",
          body: JSON.stringify(data)
        }
      );
      console.log("res", response);

      if (
        response.data?.SecondFactorAuthentication
          ?.SecondFactorAuthenticationToken
      ) {
        this.secondFactorAuthenticationToken =
          response.data?.SecondFactorAuthentication.SecondFactorAuthenticationToken;
        this.loginEmail = data.email;
      }

      return response.data!;
    } catch (error) {
      console.error("Error during login:", error);
      return {
        Profile: null,
        access_token: "",
        expires_in: "",
        SecondFactorAuthentication: undefined
      };
    }
  }

  async verifyMFA(data: MFAFormData): Promise<MFAResponse> {
    if (!this.secondFactorAuthenticationToken)
      throw new Error("No authentication token found");

    try {
      const response = await apiClient<MFAResponse>("/auth/mfa/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        body: JSON.stringify(data)
      });

      return response.data!;
    } catch (error) {
      console.error("Error verifying MFA:", error);
      return {
        token: "",
        verified: false
      };
    }
  }

  async requestOTP(): Promise<OTPResponse> {
    try {
      const response = await apiClient<OTPResponse>(
        "/identity/v2/auth/login/2fa/otp/email",
        {
          method: "POST",
          body: JSON.stringify({ emailid: this.loginEmail })
        },
        {
          secondfactorauthenticationtoken:
            this.secondFactorAuthenticationToken ?? ""
        }
      );
      console.log(response);

      return response.data!;
    } catch (error) {
      console.error("Error requesting OTP:", error);
      return {
        IsPosted: false
      };
    }
  }

  async verifyOTP(code: string): Promise<AuthResponse> {
    try {
      const response = await apiClient<OTPVerifyResponse>(
        "/identity/v2/auth/login/2fa/verification/otp/email",
        {
          method: "PUT",
          body: JSON.stringify({ emailid: this.loginEmail, Otp: code })
        },
        {
          secondfactorauthenticationtoken:
            this.secondFactorAuthenticationToken ?? ""
        }
      );
      console.log(response);
      if (response.data?.access_token) {
        this.token = response.data?.access_token;
        localStorage.setItem("spa-token", this.token);
      }
      return response.data!;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      // Assuming you have a toast function available
      return {
        Profile: null,
        access_token: "",
        expires_in: "",
        SecondFactorAuthentication: undefined
      };
      throw error;
    }
  }
  async addSMSOTP(phoneNumber: string): Promise<OTPResponse> {
    try {
      const response = await apiClient<OTPResponse>(
        "/identity/v2/auth/account/2fa",
        {
          method: "PUT",
          body: JSON.stringify({ phoneno2fa: `+91${phoneNumber}` }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`
          }
        }
      );
      console.log(response);

      return response.data!;
    } catch (error) {
      console.error("Error adding SMS OTP:", error);
      return {
        IsPosted: false
      };
    }
  }

  async addSecurityQuestions(
    questions: { QuestionId: string; Answer: string }[]
  ): Promise<OTPResponse> {
    try {
      const response = await apiClient<OTPResponse>(
        "https://dummyapi.com/auth/securityquestions",
        {
          method: "POST",
          body: JSON.stringify({ questions })
        },
        {
          secondfactorauthenticationtoken:
            this.secondFactorAuthenticationToken ?? ""
        }
      );
      console.log(response);

      return response.data!;
    } catch (error) {
      console.error("Error adding security questions:", error);
      return {
        IsPosted: false
      };
    }
  }

  async logout(): Promise<void> {
    try {
      localStorage.removeItem("spa-token");
      this.token = null;
      this.loginEmail = null;
      this.secondFactorAuthenticationToken = null;
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  async addGoogleAuthenticator(): Promise<OTPResponse> {
    try {
      const response = await apiClient<OTPResponse>(
        "https://dummyapi.com/auth/googleauthenticator",
        {
          method: "POST",
          body: JSON.stringify({})
        },
        {
          secondfactorauthenticationtoken:
            this.secondFactorAuthenticationToken ?? ""
        }
      );
      console.log(response);

      return response.data!;
    } catch (error) {
      console.error("Error adding Google Authenticator:", error);
      return {
        IsPosted: false
      };
    }
  }
  getToken(): string | null {
    return this.token;
  }
  get2FAToken(): string | null {
    return this.secondFactorAuthenticationToken;
  }

  clearToken(): void {
    this.token = null;
  }
  getEmail(): string | null {
    return this.loginEmail;
  }
}

export const authService = AuthService.getInstance();
