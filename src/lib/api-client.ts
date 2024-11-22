import { toast } from "react-hot-toast";

const API_BASE_URL = "https://api.loginradius.com"; // Replace with actual LoginRadius API URL

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || "Request failed");
  }
  return response.json();
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      ...options
    });
    return handleResponse<T>(response);
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "An error occurred");
    throw error;
  }
}
