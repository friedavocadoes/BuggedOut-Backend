"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/teams", { withCredentials: true })
      .then((res) => setTeams(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Teams</h2>
      <ul>
        {teams.map((team: any) => (
          <li key={team._id} className="p-2 bg-gray-100 rounded-md mb-2">
            {team.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
