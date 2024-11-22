import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { authService } from "../lib/auth";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const email = authService.getEmail();
  const [showDropdown, setShowDropdown] = React.useState(false);
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setShowDropdown(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const navigate = useNavigate();
  return (
    <header className="bg-blue-600 p-4 flex justify-between items-center">
      <div className="text-white text-xl font-bold">My Application</div>
      <div className="flex items-center text-white">
        <div className="relative"></div>
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <FaUserCircle
            className="mr-2 cursor-pointer"
            size={24}
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() =>
                  authService.logout().then(() => navigate("/login"))
                }
              >
                Logout
              </button>
            </div>
          )}
        </div>
        <span>{email}</span>
      </div>
    </header>
  );
};

export default Header;
