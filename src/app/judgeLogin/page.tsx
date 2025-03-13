"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function JudgeLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/judges/login", {
        username,
        password,
      });
      console.log(res.data);
      localStorage.setItem("judgeToken", res.data.token);
      router.push("/judgeDashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-3xl font-bold mb-4">Judge Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-2"
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
}
