import React from "react";

const MfaSelector: React.FC = () => {
  const options = [
    { name: "Email OTP", link: "/email-otp" },
    { name: "SMS OTP", link: "/sms-otp" },
    { name: "Google Authenticator", link: "/google-authenticator" },
    { name: "Security Questions", link: "/security-questions" }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Select MFA Login Type
        </h2>
        <ul>
          {options.map((option) => (
            <li
              key={option.name}
              className="flex justify-between items-center p-4 mb-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
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
