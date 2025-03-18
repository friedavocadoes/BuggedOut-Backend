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
    <nav className="bg-white shadow-md py-4 flex justify-between items-center px-20">
      {/* Logo */}
      <Link
        href="/"
        className="text-2xl font-bold text-indigo-600 cursor-pointer"
      >
        BuggedOut
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-6 items-center relative">
        {pathname !== "/" && (
          <Link
            href="/"
            className="text-gray-700 hover:text-indigo-600 cursor-pointer"
          >
            Home
          </Link>
        )}

        {/* User Dropdown */}
        {userToken ? (
          <div className="relative group">
            <Button variant="outline" className="cursor-pointer">
              User
            </Button>
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Team Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          pathname !== "/login" && (
            <Link href="/login">
              <Button variant="outline" className="cursor-pointer">
                Login
              </Button>
            </Link>
          )
        )}

        {/* Judge Dropdown */}
        {judgeToken ? (
          <div className="relative group">
            <Button variant="outline" className="cursor-pointer">
              Judge
            </Button>
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Link
                href="/judgeDashboard"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Judge Dashboard
              </Link>
              <button
                onClick={handleJudgeLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          pathname !== "/judgeLogin" && (
            <Link href="/judgeLogin">
              <Button variant="outline" className="cursor-pointer">
                Judge
              </Button>
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
