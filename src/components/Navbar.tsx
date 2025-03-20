"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-ui";
import { cn } from "@/lib/utils";

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
  );
}

export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem
          heerf="/leaderboard"
          setActive={setActive}
          active={active}
          item="Leaderboard"
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
          classnames="text-2xl mx-2 font-bold text-indigo-600 cursor-pointer"
        >
          {/* <div className="text-xl grid grid-cols-2 gap-10 p-4"> </div>*/}
          <HoveredLink href="/">Go to the Home Page</HoveredLink>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Pricing">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/hobby">Hobby</HoveredLink>
            <HoveredLink href="/individual">Individual</HoveredLink>
            <HoveredLink href="/team">Team</HoveredLink>
            <HoveredLink href="/enterprise">Enterprise</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
