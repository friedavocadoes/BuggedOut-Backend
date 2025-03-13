"use client";
import { useState } from "react";

import { useRouter } from "next/navigation";
import LoginForm from "../../components/LoginForm";
import Navbar from "@/components/Navbar";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (credentials) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.role === "admin") {
        router.push("/admin/dashboard");
      } else if (data.role === "judge") {
        router.push("/admin/dashboard");
      } else if (data.role === "team") {
        router.push("/team/dashboard");
      }
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <LoginForm onLogin={handleLogin} error={error} />
      </div>
    </>
  );
}
