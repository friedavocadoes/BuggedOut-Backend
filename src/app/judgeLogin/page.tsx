"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function JudgeLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("judgeToken");
    if (token) {
      router.push("/judgeDashboard");
    }
  }, [router]);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BD_URL}/api/judges/login`,
        {
          username,
          password,
        }
      );
      localStorage.setItem("judgeToken", res.data.token);
      router.push("/judgeDashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid username or password. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <AuroraBackground className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-md shadow-lg z-5 bg-neutral-500/20 backdrop-blur-xl border-neutral-600">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-neutral-300">
            Judge Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert
              variant="destructive"
              className="mb-4 bg-red-500/10 border-red-900"
            >
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3 placeholder:text-neutral-400 outline-0 border-none"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 placeholder:text-neutral-400 outline-0 border-none"
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-black text-white cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuroraBackground>
  );
}
