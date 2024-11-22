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

  const data = await response.json();
  return { data };
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string>
): Promise<ApiResponse<T>> {
  try {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.searchParams.append("apikey", import.meta.env.VITE_API_KEY);

    if (params) {
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
    }

    const response = await fetch(url.toString(), {
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
