"use client";
import { useState, useEffect } from "react";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Fetch leaderboard data
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const response = await fetch("/api/leaderboard");
    const data = await response.json();
    setLeaderboard(data);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <ul>
        {leaderboard.map((team, index) => (
          <li key={team.id} className="mb-2">
            {index + 1}. {team.name} - {team.points} points
          </li>
        ))}
      </ul>
    </div>
  );
}
