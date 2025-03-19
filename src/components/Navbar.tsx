"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useAuthTokens } from "@/hooks/useAuthTokens";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

        {pathname !== "/leaderboard" && (
          <Link
            href="/leaderboard"
            className="text-gray-700 hover:text-indigo-600 cursor-pointer"
          >
            Leaderboard
          </Link>
        )}
        {/* User Dropdown */}
        {userToken ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="cursor-pointer">
                User
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard"
                  className="block text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Team Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="cursor-pointer">
                Judge
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link
                  href="/judgeDashboard"
                  className="block text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Judge Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleJudgeLogout}
                className="text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
