"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/teams/leaderboard")
      .then((res) => setTeams(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold">Leaderboard</h2>
      <ul>
        {teams.map((team, index) => (
          <li key={team._id} className="p-2 border-b">
            <strong>
              #{index + 1} {team.name}
            </strong>{" "}
            - {team.score} points
          </li>
        ))}
      </ul>
    </div>
  );
}
