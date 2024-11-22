import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { authService } from "../lib/auth";

const Header: React.FC = () => {
  const email = authService.getEmail();

  return (
    <header className="bg-blue-600 p-4 flex justify-between items-center">
      <div className="text-white text-xl font-bold">My Application</div>
      <div className="flex items-center text-white">
        <FaUserCircle className="mr-2" size={24} />
        <span>{email}</span>
      </div>
    </header>
  );
};

export default Header;
