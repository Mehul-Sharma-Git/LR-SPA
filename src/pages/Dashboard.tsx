import React from "react";
import { Shield } from "lucide-react";
import { authService } from "../lib/auth";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 h-full bg-white shadow-md">
      <ul className="space-y-2">
        <li>
          <Link
            to="/dashboard"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/add-mfa"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200"
          >
            Add MFA Authenticator
          </Link>
        </li>
      </ul>
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!authService.getToken()) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <Shield className="mx-auto h-12 w-12 text-gray-400" />
                  <h2 className="mt-2 text-lg font-medium text-gray-900">
                    Welcome to the Dashboard
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    You've successfully authenticated!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
