import React from "react";
import { authService } from "../lib/auth";
import { TbRuler2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const MfaSelector: React.FC = () => {
  const configuredMFA = authService.getConfiguredMFA();
  console.log(configuredMFA);
  const options = [
    {
      name: "Email OTP",
      link: "/verify-otp",
      enabled: TbRuler2
    },
    {
      name: "SMS OTP",
      link: "/verify-sms-otp",
      enabled: configuredMFA.isPhoneEnabled
    },

    {
      name: "Google Authenticator",
      link: "/verify-google-authenticator",
      enabled: configuredMFA.isGoogleAuthenticatorEnabled
    },
    {
      name: "Security Questions",
      link: "/verify-security-questions",
      enabled: configuredMFA.isSecurityQuestionsEnabled
    }
  ].filter((option) => option.enabled);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Select MFA Login Type
        </h2>
        <ul>
          {options
            .filter((option) => option.enabled)
            .map((option) => (
              <li
                key={option.name}
                className="flex justify-between items-center p-4 mb-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  navigate(option.link);
                }}
              >
                <span>{option.name}</span>
                <a
                  href={option.link}
                  className="text-blue-500 hover:text-blue-700"
                >
                  &rarr;
                </a>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default MfaSelector;
