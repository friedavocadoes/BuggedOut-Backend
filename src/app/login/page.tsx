"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in (has a valid token)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BD_URL}/api/auth/login`,
        formData,
        { withCredentials: true } // Ensures cookies are sent/received
      );

      if (res.data.success) {
        const token = res.data.token; // Make sure backend returns token in response
        if (token) {
          localStorage.setItem("token", token);
        }
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <AuroraBackground className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg z-5 bg-neutral-500/20 backdrop-blur-xl border-neutral-600">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-neutral-300">
            Team Login
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
              type="text"
              placeholder="Team Name"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="p-3 placeholder:text-neutral-400 outline-0 border-none"
            />
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="p-3 placeholder:text-neutral-400 outline-0 border-none"
            />
            <Button
              onClick={handleSubmit}
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
