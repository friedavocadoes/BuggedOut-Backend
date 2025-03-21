"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface decodedToken {
  id: string;
}
interface TeamMember {
  _id: string;
  name: string;
  reg_no: string;
  gender: string;
}

interface Team {
  _id: string;
  name: string;
  stack: string;
  members: TeamMember[];
  blacklisted: boolean;
}

interface Bug {
  _id: string;
  round: number;
  category: string;
  description: string;
  steps: string;
  filename: string;
  status: string;
  score: number;
  fix: string;
  explanation: string;
}
export default function TeamDashboard() {
  const [team, setTeam] = useState<Team | null>(null);
  const [submissions, setSubmissions] = useState<Bug[]>([]);
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [bugForm, setBugForm] = useState({
    round: 1,
    category: "",
    description: "",
    steps: "",
    filename: "",
    fix: "",
    explanation: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [submitLoader, setSubmitLoader] = useState(false);
  const [bugLoader, setBugLoader] = useState(false);

  useEffect(() => {
    setBugLoader(true);
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        const decodedToken: decodedToken = jwtDecode(storedToken);
        console.log(decodedToken);
        const teamId = decodedToken.id;

        axios
          .get(`${process.env.NEXT_PUBLIC_BD_URL}/api/auth/me/${teamId}`, {
            withCredentials: true,
          })
          .then((res) => {
            setTeam(res.data);
            console.log(res.data);
          })
          .catch((err) => console.error(err));

        // ✅ Fetch previous bug submissions
        axios
          .get(`${process.env.NEXT_PUBLIC_BD_URL}/api/bugs/team/${teamId}`, {
            withCredentials: true,
          })
          .then((res) => {
            setSubmissions(res.data);
          })
          .catch((err) => console.error("Error fetching submissions:", err));
      } else {
        router.push("/login");
      }
    }
    setBugLoader(false);
  }, []);

  const handleBugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoader(true);
    setMessage("");
    if (team?.blacklisted) {
      setMessage("Your team has been blacklisted. You cannot submit bugs.");
      return;
    }

    try {
      console.log({ bugForm, teamId: team?._id });
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BD_URL}/api/bugs/submit`,
        { bugForm, teamId: team?._id },
        { withCredentials: true }
      );

      setMessage(res.data.message);
      setBugForm({
        round: 1,
        category: "",
        description: "",
        steps: "",
        filename: "",
        fix: "",
        explanation: "",
      });

      // ✅ Refresh submissions after submitting
      axios
        .get(`${process.env.NEXT_PUBLIC_BD_URL}/api/bugs/team/${team?._id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setSubmissions(res.data);
        });
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit bug.");
    }

    setSubmitLoader(false);
  };

  return (
    <>
      <div className="flex items-center flex-col p-6 px-40 pt-36 bg-black min-h-screen text-white">
        <Card className="w-full max-w-4xl mb-8 bg-neutral-100/5 backdrop-blur-sm border-zinc-600">
          <CardHeader>
            <CardTitle className="text-center text-2xl md:text-4xl font-extrabold text-zinc-300">
              Team Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-lg md:text-xl text-zinc-500 -mt-5">
              Submit and view Bugs
            </p>
          </CardContent>
        </Card>

        {/* team name and info */}
        {team ? (
          <Card
            className={`p-6 rounded-lg shadow-md w-1/2 mb-8 ${
              team.blacklisted
                ? "bg-red-900/60 backdrop-blur-sm border-amber-600 text-white"
                : "bg-green-700/40 backdrop-blur-sm border-zinc-600 text-white"
            }`}
          >
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                {team.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-md text-center -mt-8 ml-2 font-light">
                Tech stack: {team.stack}
              </p>
              <p className="mt-4 text-center font-semibold text-xl">Members</p>
              <ul className="text-center font-light">
                {team.members.map((member: TeamMember) => (
                  <li key={member._id}>
                    {member.name} ({member.reg_no})
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-center">
                Blacklisted:{" "}
                {team.blacklisted
                  ? "Yes (you can no longer work on BuggedOut)."
                  : "No"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Skeleton className="p-6 rounded-lg shadow-md w-1/2 mb-8 h-32 bg-neutral-500/40 backdrop-blur-sm border-zinc-600" />
        )}

        {/* ✅ Bug Submission Form */}
        <Card className="mt-2 bg-neutral-100/5 backdrop-blur-sm border-zinc-600 text-white p-6 shadow-md w-full px-20 py-16 rounded-4xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold mb-4 text-center">
              Submit a Bug
            </CardTitle>
          </CardHeader>
          <CardContent className="px-20">
            <form
              onSubmit={handleBugSubmit}
              className="space-y-4 flex flex-col"
            >
              <select
                value={bugForm.round}
                onChange={(e) =>
                  setBugForm({ ...bugForm, round: Number(e.target.value) })
                }
                className="w-full p-3 border rounded bg-black text-white border-zinc-800 outline-zinc-800"
              >
                <option value="1">Round 1</option>
                <option value="2">Round 2</option>
              </select>

              <select
                value={bugForm.category}
                onChange={(e) =>
                  setBugForm({ ...bugForm, category: e.target.value })
                }
                className="w-full p-3 border rounded bg-black text-white border-zinc-800 outline-zinc-800"
                required
              >
                <option value="" disabled>
                  Select a Category
                </option>
                <option value="Functional">Functional</option>
                <option value="Usability">Usability</option>
                <option value="Security">Security</option>
                <option value="Logical">Logical</option>
                <option value="Compatibility">Compatibility</option>
              </select>

              <textarea
                placeholder="Bug Description"
                value={bugForm.description}
                onChange={(e) =>
                  setBugForm({ ...bugForm, description: e.target.value })
                }
                className="w-full p-3 border rounded bg-black text-white border-zinc-800 outline-zinc-800"
                required
              />

              <textarea
                placeholder="Steps to Recreate"
                value={bugForm.steps}
                onChange={(e) =>
                  setBugForm({ ...bugForm, steps: e.target.value })
                }
                className="w-full p-3 border rounded bg-black text-white border-zinc-800 outline-zinc-800"
                required
              />

              <input
                type="text"
                placeholder="Filename with Path"
                value={bugForm.filename}
                onChange={(e) =>
                  setBugForm({ ...bugForm, filename: e.target.value })
                }
                className="w-full p-3 border rounded bg-black text-white border-zinc-800 outline-zinc-800"
                required
              />

              {bugForm.round === 2 && (
                <>
                  <textarea
                    placeholder="Suggested Fix (Code Input)"
                    value={bugForm.fix || ""}
                    onChange={(e) =>
                      setBugForm({ ...bugForm, fix: e.target.value })
                    }
                    className="w-full p-3 border rounded bg-black text-white border-zinc-800 outline-zinc-800"
                    required
                  />

                  <textarea
                    placeholder="Explain Solution"
                    value={bugForm.explanation || ""}
                    onChange={(e) =>
                      setBugForm({
                        ...bugForm,
                        explanation: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded bg-black text-white border-zinc-800 outline-zinc-800"
                    required
                  />
                </>
              )}

              <Button
                type="submit"
                className={`hover:opacity-80 transition-opacity duration-200 h-12 cursor-pointer mx-auto w-1/2 ${
                  team?.blacklisted
                    ? "bg-red-800 cursor-not-allowed"
                    : "bg-green-600"
                }`}
                disabled={team?.blacklisted}
              >
                {submitLoader ? <Loader2 /> : "Submit"}
              </Button>
            </form>
            {message && (
              <p className="text-green-400 text-center mt-4">{message}</p>
            )}
          </CardContent>
        </Card>

        {/* ✅ Bug Submissions Section */}
        <Card className="mt-8 bg-gray-900 text-white p-6 w-full">
          <CardHeader>
            <CardTitle className="text-xl mb-4 text-center">
              Previous Bug Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!bugLoader ? (
              submissions.length > 0 ? (
                <ul className="space-y-3">
                  {submissions.map((bug: Bug) => (
                    <li
                      key={bug._id}
                      className="p-4 bg-black rounded shadow hover:bg-gray-800 cursor-pointer"
                      onClick={() => setSelectedBug(bug)}
                    >
                      <p className="font-semibold text-white">{bug.category}</p>
                      <p className="text-sm text-gray-400">Round {bug.round}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400 mb-10 text-center">
                  Nothing to show here
                </div>
              )
            ) : (
              <Skeleton className="h-24 w-full bg-neutral-500/65" />
            )}
          </CardContent>
        </Card>

        {/* ✅ Show Bug Details when clicked */}
        {selectedBug && (
          <Card className="mt-8 bg-gray-800 text-white p-6 w-full">
            <CardHeader>
              <CardTitle className="text-xl">Bug Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{selectedBug.category}</p>
              <p className="text-sm text-gray-400">
                Round: {selectedBug.round}
              </p>
              <p className="mt-4">{selectedBug.description}</p>
              <p className="text-sm text-gray-400 mt-4">
                <strong>Steps to Reproduce:</strong> {selectedBug.steps}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                <strong>Filename:</strong> {selectedBug.filename}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                <strong>Status:</strong> {selectedBug.status}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                <strong>Score:</strong> {selectedBug.score}
              </p>

              <Button
                onClick={() => setSelectedBug(null)}
                className="mt-4 bg-red-700 text-white cursor-pointer"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
