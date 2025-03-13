import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// API for teams
export const getTeams = async () => {
  const response = await api.get("/teams");
  return response.data;
};

export const createTeam = async (teamName: string, password: string) => {
  const response = await api.post("/teams/create", { teamName, password });
  return response.data;
};

// API for submissions
export const submitBug = async (teamId: string, title: string, description: string) => {
  const response = await api.post("/bugs/submit", { teamId, title, description });
  return response.data;
};

export const getLeaderboard = async () => {
  const response = await api.get("/leaderboard");
  return response.data;
};
