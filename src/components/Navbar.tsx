"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-indigo-600">
        Bug Bounty
      </Link>
      <div className="flex gap-4">
        {pathname !== "/" && (
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
        )}
        {pathname !== "/login" && (
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        )}
        <Link href="/judgeLogin">Judge</Link>
      </div>
    </nav>
  );
}
