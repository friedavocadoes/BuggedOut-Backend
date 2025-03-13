import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [teams, setTeams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Fetch teams, submissions, and leaderboard data
    fetchTeams();
    fetchSubmissions();
    fetchLeaderboard();
  }, []);

  const fetchTeams = async () => {
    const response = await fetch("/api/teams");
    const data = await response.json();
    setTeams(data);
  };

  const fetchSubmissions = async () => {
    const response = await fetch("/api/submissions");
    const data = await response.json();
    setSubmissions(data);
  };

  const fetchLeaderboard = async () => {
    const response = await fetch("/api/leaderboard");
    const data = await response.json();
    setLeaderboard(data);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <section>
        <h2 className="text-xl font-semibold mb-2">Teams</h2>
        {/* Add, edit, and delete teams */}
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Submissions</h2>
        {/* Check submissions from teams */}
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Leaderboard</h2>
        {/* Update leaderboard */}
      </section>
    </div>
  );
}
