"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/leaderboard")
      .then((res) => setLeaderboard(res.data.slice(0, 3))) // Show Top 3
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center py-20 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <h1 className="text-5xl font-bold">c</h1>
        <p className="mt-4 text-lg">asd</p>
        <Button
          className="mt-6 bg-white text-indigo-600"
          onClick={() => router.push("/login")}
        >
          Get Started
        </Button>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-8">
        <h2 className="text-3xl font-semibold text-center">How It Works</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center mt-8">
          <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold">a</h3>
            <p className="text-gray-600 mt-2">te</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold">b</h3>
            <p className="text-gray-600 mt-2">fl</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold">s</h3>
            <p className="text-gray-600 mt-2">poi</p>
          </div>
        </div>
      </section>

      {/* LEADERBOARD PREVIEW */}
      <section className="py-16 px-8 bg-gray-50">
        <h2 className="text-3xl font-semibold text-center">Leaderboard</h2>
        <div className="mt-8 flex flex-col items-center">
          {leaderboard.length > 0 ? (
            leaderboard.map((team, index) => (
              <div
                key={team._id}
                className="bg-white p-4 rounded-lg shadow-md w-80 mb-4 text-center"
              >
                <h3 className="text-lg font-semibold">
                  {index + 1}. {team.name}
                </h3>
                <p className="text-gray-600">{team.points} Points</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 px-8 bg-indigo-600 text-white text-center">
        <h2 className="text-3xl font-semibold">Ready to Hunt Bugs?</h2>
        <p className="mt-4">Join the challenge now and prove your skills!</p>
        <Button
          className="mt-6 bg-white text-indigo-600"
          onClick={() => router.push("/login")}
        >
          Join Now
        </Button>
      </section>
    </div>
  );
}
