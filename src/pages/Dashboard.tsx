import React from "react";
import { Shield } from "lucide-react";
import { authService } from "../lib/auth";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const navigate = useNavigate();
  React.useEffect(() => {
    // Redirect if no auth token is present
    if (!authService.getToken()) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
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
    </div>
  );
}
