"use client";
import React, { useEffect, useState } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-ui";
import { useRouter, usePathname } from "next/navigation";
import { useAuthTokens } from "@/hooks/useAuthTokens";
import { cn } from "@/lib/utils";

export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { userToken, judgeToken, updateTokens } = useAuthTokens();

  useEffect(() => {
    updateTokens();
  }, [pathname]);

  const handleLogout = () => {
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
    <div
      className={cn("fixed top-6 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem
          heerf="/leaderboard"
          setActive={setActive}
          active={active}
          item="Leaderboard"
          classnames="text-neutral-100 cursor-pointer font-light"
        >
          <HoveredLink href="/leaderboard">
            View your rank among other Teams
          </HoveredLink>
        </MenuItem>
        <MenuItem
          heerf="/"
          setActive={setActive}
          active={active}
          item="BuggedOut"
          classnames="text-2xl md:mx-4 font-bold text-emerald-800 cursor-pointer"
        >
          {/* <div className="text-xl grid grid-cols-2 gap-10 p-4"> </div>*/}
          <HoveredLink href="/">Go to the Home Page</HoveredLink>
        </MenuItem>

        <MenuItem
          setActive={setActive}
          active={active}
          item={userToken || judgeToken ? "Dashboard" : "Login"}
          classnames="text-neutral-100 cursor-pointer font-light"
        >
          <div className="flex flex-col space-y-4 text-sm">
            {userToken ? (
              <>
                <HoveredLink href="/dashboard">Submit Bugs</HoveredLink>
                <div
                  onClick={handleLogout}
                  className="cursor-pointer text-white hover:text-red-700"
                >
                  Logout
                </div>
              </>
            ) : (
              <HoveredLink href="/login">Team Login</HoveredLink>
            )}

            {judgeToken ? (
              <>
                <HoveredLink href="/judgeDashboard">
                  Judge Dashboard
                </HoveredLink>
                <div
                  onClick={handleJudgeLogout}
                  className="cursor-pointer text-white hover:text-red-700"
                >
                  Logout
                </div>
              </>
            ) : (
              <HoveredLink href="/judgeLogin">Judge Login</HoveredLink>
            )}
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
