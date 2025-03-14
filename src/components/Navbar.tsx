"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useState } from "react";
import { useAuthTokens } from "@/hooks/useAuthTokens";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showJudgeDropdown, setShowJudgeDropdown] = useState(false);
  const { userToken, judgeToken, updateTokens } = useAuthTokens();

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    updateTokens();
    router.push("/login");
  };

  const handleJudgeLogout = () => {
    localStorage.removeItem("judgeToken");
    updateTokens();
    router.push("/judgeLogin");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-indigo-600">
        Bug Bounty
      </Link>
      <div className="flex gap-4 relative">
        {pathname !== "/" && (
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
        )}
        {!userToken && pathname !== "/login" && (
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        )}
        {userToken && (
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              User
            </Button>
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full text-left">
                    Team Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full text-left"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        )}
        {!judgeToken && pathname !== "/judgeLogin" && (
          <Link href="/judgeLogin">
            <Button variant="outline">Judge</Button>
          </Link>
        )}
        {judgeToken && (
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowJudgeDropdown(!showJudgeDropdown)}
            >
              Judge
            </Button>
            {showJudgeDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                <Link href="/judgeDashboard">
                  <Button variant="ghost" className="w-full text-left">
                    Judge Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full text-left"
                  onClick={handleJudgeLogout}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
