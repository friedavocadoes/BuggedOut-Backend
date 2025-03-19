"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function TeamDashboard() {
  const [team, setTeam] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]); // ✅ Store bug submissions
  const [selectedBug, setSelectedBug] = useState<any>(null); // ✅ Track selected bug
  const [bugForm, setBugForm] = useState({
    round: 1,
    category: "",
    description: "",
    steps: "",
    filename: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        const decodedToken = jwtDecode(storedToken);
        console.log(decodedToken);
        const teamId = decodedToken.id;

        axios
          .get(`http://localhost:5000/api/auth/me/${teamId}`, {
            withCredentials: true,
          })
          .then((res) => {
            setTeam(res.data);
            console.log(res.data);
          })
          .catch((err) => console.error(err));

        // ✅ Fetch previous bug submissions
        axios
          .get(`http://localhost:5000/api/bugs/team/${teamId}`, {
            withCredentials: true,
          })
          .then((res) => {
            setSubmissions(res.data);
          })
          .catch((err) => console.error("Error fetching submissions:", err));
      }
    }
  }, []);

  const handleBugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      console.log({ bugForm, teamId: team._id });
      const res = await axios.post(
        "http://localhost:5000/api/bugs/submit",
        { bugForm, teamId: team._id },
        { withCredentials: true }
      );

      setMessage(res.data.message);
      setBugForm({
        round: 1,
        category: "",
        description: "",
        steps: "",
        filename: "",
      });

      // ✅ Refresh submissions after submitting
      axios
        .get(`http://localhost:5000/api/bugs/team/${team._id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setSubmissions(res.data);
        });
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit bug.");
    }
  };

  return (
    <div className="p-6 px-40">
      <h2 className="text-2xl font-semibold mb-4">Team Dashboard</h2>

      {team && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold">{team.name}</h3>
          <h3 className="text-md font-medium text-gray-700">
            Tech stack: {team.stack}
          </h3>
          <p className="text-gray-600">Members:</p>
          <ul className="list-disc pl-5">
            {team.members.map((member: any) => (
              <li key={member._id}>
                {member.name} (Reg No: {member.reg_no}, Gender: {member.gender})
              </li>
            ))}
          </ul>
          <p className="text-gray-600 mt-4">
            Blacklisted: {team.blacklisted ? "Yes" : "No"}
          </p>
        </div>
      )}

      {/* ✅ Bug Submission Form */}
      <div className="mt-6 bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Submit a Bug</h3>
        <form onSubmit={handleBugSubmit} className="space-y-3">
          <select
            value={bugForm.round}
            onChange={(e) =>
              setBugForm({ ...bugForm, round: Number(e.target.value) })
            }
            className="w-full p-2 border rounded"
          >
            <option value="1">Round 1</option>
            <option value="2">Round 2</option>
          </select>

          <input
            type="text"
            placeholder="Bug Category"
            value={bugForm.category}
            onChange={(e) =>
              setBugForm({ ...bugForm, category: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />

          <textarea
            placeholder="Bug Description"
            value={bugForm.description}
            onChange={(e) =>
              setBugForm({ ...bugForm, description: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />

          <textarea
            placeholder="Steps to Recreate"
            value={bugForm.steps}
            onChange={(e) => setBugForm({ ...bugForm, steps: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="text"
            placeholder="Filename with Path"
            value={bugForm.filename}
            onChange={(e) =>
              setBugForm({ ...bugForm, filename: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
        </form>

        {message && <p className="text-red-500 mt-2">{message}</p>}
      </div>

      {/* ✅ Bug Submissions Section */}
      <div className="mt-6 bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Previous Bug Submissions</h3>
        {submissions.length > 0 ? (
          <ul className="space-y-2">
            {submissions.map((bug: any) => (
              <li
                key={bug._id}
                className="p-3 bg-white rounded-md shadow cursor-pointer hover:bg-gray-200"
                onClick={() => setSelectedBug(bug)}
              >
                <p className="font-semibold">{bug.category}</p>
                <p className="text-sm text-gray-500">Round {bug.round}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No bug reports submitted yet.</p>
        )}
      </div>
      {/* ✅ Show Bug Details when clicked */}
      {selectedBug && (
        <div className="mt-6 bg-gray-200 p-4 rounded-md">
          <h3 className="text-lg font-semibold">Bug Details</h3>
          <p className="font-semibold">{selectedBug.category}</p>
          <p className="text-sm text-gray-600">Round: {selectedBug.round}</p>
          <p className="mt-2">{selectedBug.description}</p>
          <p className="text-sm text-gray-500 mt-2">
            <strong>Steps to Reproduce:</strong> {selectedBug.steps}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            <strong>Filename:</strong> {selectedBug.filename}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            <strong>Status:</strong> {selectedBug.status}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            <strong>Score:</strong> {selectedBug.score}
          </p>
          <button
            onClick={() => setSelectedBug(null)}
            className="mt-3 bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
