import { api } from "./api";

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { username, password });
    localStorage.setItem("token", response.data.token);
    return response.data.user;
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};

export const getUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const response = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
