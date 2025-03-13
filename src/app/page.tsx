"use client";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to the Bug Bounty App
        </h1>
        <p className="text-lg mb-4">
          This is the home page of the Bug Bounty App. Use the navigation bar to
          explore the app.
        </p>
        <div className="flex gap-4">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/login"
          >
            Login
          </a>
          <a
            className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center hover:bg-gray-200 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="/leaderboard"
          >
            View Leaderboard
          </a>
        </div>
      </div>
    </div>
  );
}
