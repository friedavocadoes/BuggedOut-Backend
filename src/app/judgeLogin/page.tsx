"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react"; // For the loading spinner

export default function JudgeLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("judgeToken");
    if (token) {
      router.push("/judgeDashboard");
    }
  }, [router]);

  const handleLogin = async () => {
    setError("");
    setLoading(true); // Start loading

    try {
      const res = await axios.post("http://localhost:5000/api/judges/login", {
        username,
        password,
      });
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-black">
            Judge Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3"
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-black text-white"
              disabled={loading} // Disable button while loading
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
    </div>
  );
}
