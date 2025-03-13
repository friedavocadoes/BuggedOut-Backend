import Link from "next/link";

export default function Navbar() {
  const makeAdmin = async () => {
    console.log("Making admin");
    const response = await fetch("/api/scripts/createAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: "gautham", password: "spiderman" }),
    });
    console.log(response);
  };
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">Bug Bounty App</div>
        <div className="flex space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link href="/login" className="text-gray-300 hover:text-white">
            Login
          </Link>
          <Link href="/leaderboard" className="text-gray-300 hover:text-white">
            Leaderboard
          </Link>
          <div onClick={makeAdmin}>Make Admin</div>
        </div>
      </div>
    </nav>
  );
}
