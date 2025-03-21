"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { XIcon } from "@heroicons/react/solid";
import { Loader2 } from "lucide-react";

interface Member {
  name: string;
  reg_no: number;
  gender: string;
}

interface Team {
  _id: string;
  name: string;
  password: string;
  stack: string;
  members: Member[];
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
  submittedAt: string;
  team: {
    id: string;
    name: string;
  };
}

export default function JudgeDashboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [teamName, setTeamName] = useState<string>("");
  const [teamPassword, setTeamPassword] = useState<string>(""); // Password state
  const [teamStack, setTeamStack] = useState<string>(""); // Stack state
  const [members, setMembers] = useState<Member[]>([]);
  const [memberInput, setMemberInput] = useState<Member>({
    name: "",
    reg_no: 0,
    gender: "",
  });
  const [newMember, setNewMember] = useState<Member>({
    name: "",
    reg_no: 0,
    gender: "",
  });
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null); // Selected bug for modal
  const [showBugModal, setShowBugModal] = useState<boolean>(false); // Show/hide bug details modal
  const [sortOrder, setSortOrder] = useState<string>(""); // Sorting order state
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Open bug details modal
  const handleViewBug = (bug: Bug) => {
    setSelectedBug(bug);
    setShowBugModal(true);
  };

  // Close bug details modal
  const handleCloseBugModal = () => {
    setShowBugModal(false);
    setSelectedBug(null);
  };

  // Add this function to handle updating the bug's score and status
  const handleUpdateBug = async (bugId: string, updatedBug: Bug) => {
    const token = localStorage.getItem("judgeToken");
    setLoading(true);

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BD_URL}/api/bugs/update/${bugId}`,
        updatedBug,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBugs(bugs.map((bug) => (bug._id === bugId ? res.data.bug : bug)));
      setShowBugModal(false);
      setSelectedBug(null);
    } catch (err) {
      console.error("Error updating bug:", err);
    }
    setLoading(false);
  };

  const fetchBugs = async () => {
    const token = localStorage.getItem("judgeToken");
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BD_URL}/api/teams/bugs`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBugs(res.data);
    } catch (err) {
      console.error("Error fetching bugs:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("judgeToken");
    if (!token) router.push("/judgeLogin");

    axios
      .get(`${process.env.NEXT_PUBLIC_BD_URL}/api/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTeams(res.data);
        setFilteredTeams(res.data);
      })
      .catch(() => router.push("/judgeLogin"));
    fetchBugs();
  }, []);

  // Filter teams based on search query
  useEffect(() => {
    setFilteredTeams(
      teams.filter((team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, teams]);

  useEffect(() => {
    // Function to fetch bug submissions

    // Fetch bugs initially
    fetchBugs();

    // Set up polling to fetch bugs every 5 seconds
    const interval = setInterval(fetchBugs, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Create a new team
  const handleCreateTeam = async () => {
    setLoading(true);
    if (!teamName || !teamPassword || !teamStack)
      return alert("Enter a team name, password, and stack");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BD_URL}/api/teams/create`,
        { name: teamName, password: teamPassword, stack: teamStack, members }
      );
      console.log(process.env.NEXT_PUBLIC_BD_URL);
      setTeams([...teams, res.data]);
      setFilteredTeams([...teams, res.data]);
      setTeamName("");
      setTeamPassword("");
      setTeamStack("");
      setMembers([]);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Error creating team:", err);
    }
    setLoading(false);
  };

  // Add members before team creation
  const handleAddMemberBefore = () => {
    if (!memberInput.name || !memberInput.reg_no || !memberInput.gender) return;
    setMembers([...members, memberInput]);
    setMemberInput({ name: "", reg_no: 0, gender: "" });
  };

  // Add members to an existing team
  const handleAddMemberAfter = async (teamId: string) => {
    setLoading(true);
    const token = localStorage.getItem("judgeToken");
    if (!newMember.name || !newMember.reg_no || !newMember.gender)
      return alert("Enter all member details");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BD_URL}/api/teams/${teamId}/add-member`,
        newMember,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTeams(teams.map((team) => (team._id === teamId ? res.data : team)));
      setFilteredTeams(
        teams.map((team) => (team._id === teamId ? res.data : team))
      );
      setNewMember({ name: "", reg_no: 0, gender: "" });
    } catch (err) {
      console.error("Error adding member:", err);
    }
    setLoading(false);
  };

  // Open edit modal
  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setShowEditModal(true);
  };

  // Close edit modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setShowCreateModal(false);
    setSelectedTeam(null);
  };

  // Remove member from team
  const handleRemoveMember = async (teamId: string, memberId: number) => {
    const token = localStorage.getItem("judgeToken");
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BD_URL}/api/teams/${teamId}/remove-member/${memberId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTeams(teams.map((team) => (team._id === teamId ? res.data : team)));
      setFilteredTeams(
        teams.map((team) => (team._id === teamId ? res.data : team))
      );
    } catch (err) {
      console.error("Error removing member:", err);
    }
  };

  // Toggle blacklist status
  const handleToggleBlacklist = async (teamId: string) => {
    setLoading(true);
    const token = localStorage.getItem("judgeToken");
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BD_URL}/api/teams/blacklist/${teamId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTeams(teams.map((team) => (team._id === teamId ? res.data : team)));
    } catch (err) {
      console.error("Error toggling blacklist:", err);
    }
    setLoading(false);
  };

  const sortedBugs = [...bugs].sort((a) => {
    if (sortOrder === "pending") {
      return a.status === "pending" ? -1 : 1;
    } else if (sortOrder === "approved") {
      return a.status === "approved" ? -1 : 1;
    } else if (sortOrder === "rejected") {
      return a.status === "rejected" ? -1 : 1;
    } else if (sortOrder === "Round 1") {
      return a.round === 1 ? -1 : 1;
    } else if (sortOrder === "Round 2") {
      return a.round === 2 ? -1 : 1;
    }
    return 0;
  });

  return (
    <div className="p-6 px-40 pt-40 bg-neutral-100">
      <h2 className="text-3xl font-bold">Judge Dashboard</h2>

      {/* Bug Submissions Section */}
      <h3 className="text-2xl mt-6 mb-4">Bug Submissions</h3>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Sort by Status:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-30 p-1 border rounded"
        >
          <option value="">Select Order</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="Round 1">Round 1</option>
          <option value="Round 2">Round 2</option>
        </select>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {sortedBugs.map((bug) => (
          <div
            key={bug._id}
            className={`p-4 border rounded-lg shadow-md ${
              bug.status === "pending"
                ? "bg-yellow-100"
                : bug.status === "approved"
                ? "bg-green-100"
                : bug.status === "rejected"
                ? "bg-red-200"
                : "bg-white"
            }`}
          >
            <h4 className="text-xl font-semibold">{bug.team.name}</h4>
            <p className="text-sm text-gray-500">
              Submitted: {new Date(bug.submittedAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Status: {bug.status}</p>
            <p className="text-sm text-gray-500">Category: {bug.category}</p>
            <p className="text-sm text-gray-500">Round: {bug.round}</p>
            <Button
              onClick={() => handleViewBug(bug)}
              className="mt-2 cursor-pointer"
            >
              View Submission
            </Button>
          </div>
        ))}
      </div>

      {/* Bug Details Modal */}
      {showBugModal && selectedBug && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full relative mx-20 p -10 ">
            <XIcon
              className="h-6 w-6 text-gray-500 absolute top-2 right-2 cursor-pointer"
              onClick={handleCloseBugModal}
            />
            <h3 className="text-2xl font-semibold mb-4">
              Bug Submission by {selectedBug.team.name}
            </h3>
            <p className="text-sm text-gray-500">
              Submitted: {new Date(selectedBug.submittedAt).toLocaleString()}
            </p>
            <p className="mt-4 text-gray-800">Round: {selectedBug.round}</p>
            <p className="mt-4 text-gray-800">
              Category: {selectedBug.category}
            </p>
            <p className="mt-4 text-gray-800">
              Description: {selectedBug.description}
            </p>
            <p className="mt-4 text-gray-800">Steps: {selectedBug.steps}</p>
            <p className="mt-4 text-gray-800">
              Filename: {selectedBug.filename}
            </p>

            {selectedBug.round === 2 && (
              <>
                <p className="mt-4 text-gray-800">Fix: {selectedBug.fix}</p>
                <p className="mt-4 text-gray-800">
                  Explanation: {selectedBug.explanation}
                </p>
              </>
            )}

            <div className="mt-4">
              <label className="block text-gray-700">Score:</label>
              <input
                type="number"
                value={selectedBug.score}
                onChange={(e) =>
                  setSelectedBug({
                    ...selectedBug,
                    score: Number(e.target.value),
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700">Status:</label>
              <select
                value={selectedBug.status}
                onChange={(e) =>
                  setSelectedBug({ ...selectedBug, status: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <Button
              onClick={() => handleUpdateBug(selectedBug._id, selectedBug)}
              className="w-full mt-4 cursor-pointer"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Submit Grade"}
            </Button>
          </div>
        </div>
      )}

      {/* Team Management */}
      <h3 className="text-2xl mt-6">Teams</h3>
      {/* Create Team Button */}
      <Button
        onClick={() => setShowCreateModal(true)}
        className="mt-4 cursor-pointer"
      >
        + Create Team
      </Button>
      {/* Search Bar */}
      <div className="my-4">
        <Input
          placeholder="Search Teams"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/4"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filteredTeams.map((team) => (
          <div
            key={team._id}
            className={`p-4 border rounded-lg shadow-md ${
              team.blacklisted && "bg-red-800/60"
            }`}
          >
            <h4 className="text-xl font-semibold">{team.name}</h4>
            <p>Password: {team.password}</p>
            <p>Stack: {team.stack}</p>
            <p>Members:</p>
            <ul>
              {team.members.map((m) => (
                <li key={m.reg_no}>
                  {m.name} ({m.gender}) - {m.reg_no}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleToggleBlacklist(team._id)}
              className="mt-2 cursor-pointer mr-2 rounded-xs"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Toggle Blacklist"
              )}
            </Button>
            <Button
              onClick={() => handleEditTeam(team)}
              className="mt-2 cursor-pointer rounded-xs"
            >
              Edit Team
            </Button>
          </div>
        ))}
      </div>

      {/* Edit Team Modal */}
      {showEditModal && selectedTeam && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl">
          <div className="bg-neutral-300/80 p-6 rounded-lg shadow-lg w-1/2 relative mt-24">
            <XIcon
              className="h-6 w-6 text-gray-500 absolute top-2 right-2 cursor-pointer"
              onClick={handleCloseModal}
            />
            <h3 className="text-2xl font-semibold mb-4">Edit Team</h3>
            <p className="mb-2">Team Name: {selectedTeam.name}</p>
            <p className="mb-2">Password: {selectedTeam.password}</p>
            <p className="mb-2">Stack: {selectedTeam.stack}</p>
            <p className="mb-2">Members:</p>
            <ul className="mb-4">
              {selectedTeam.members.map((m) => (
                <li
                  key={m.reg_no}
                  className="flex justify-between items-center"
                >
                  {m.name} ({m.gender}) - {m.reg_no}
                  <Button
                    onClick={() =>
                      handleRemoveMember(selectedTeam._id, m.reg_no)
                    }
                    className="ml-2"
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
            <Input
              placeholder="New Member Name"
              value={newMember.name}
              onChange={(e) =>
                setNewMember({ ...newMember, name: e.target.value })
              }
              className="mb-2"
            />
            <Input
              placeholder="Registration Number"
              type="number"
              value={newMember.reg_no}
              onChange={(e) =>
                setNewMember({ ...newMember, reg_no: Number(e.target.value) })
              }
              className="mb-2"
            />
            <select
              value={newMember.gender}
              onChange={(e) =>
                setNewMember({ ...newMember, gender: e.target.value })
              }
              className="mb-2 w-full p-2 border rounded"
            >
              <option value="">Select Gender</option>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>

            <Button
              onClick={() => handleAddMemberAfter(selectedTeam._id)}
              className="w-full mb-2"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
              ) : (
                "Add Member"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl backdrop-brightness-40">
          <div className="bg-white p-6 px-20 rounded-lg shadow-lg w-1/2 h-150 flex flex-col items-center align-middle">
            <XIcon
              className="h-6 w-6 text-gray-500 ml-170 top-2 right-2 cursor-pointer"
              onClick={handleCloseModal}
            />
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Create Team
            </h3>
            <Input
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Password"
              type="password"
              value={teamPassword}
              onChange={(e) => setTeamPassword(e.target.value)}
              className="mb-2"
            />
            <select
              value={teamStack}
              onChange={(e) => setTeamStack(e.target.value)}
              className="mb-2 w-full p-2 border rounded"
            >
              <option value="">Select Stack</option>
              <option value="MERN">MERN</option>
              <option value="NodeJS">NodeJS</option>
              <option value="Python">Python</option>
            </select>
            <h3 className="text-xl font-semibold mb-4 mt-6 text-center">
              Member Details
            </h3>
            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-2 mt-2 mx-10">
                <Input
                  placeholder="Member Name"
                  value={memberInput.name}
                  onChange={(e) =>
                    setMemberInput({ ...memberInput, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Registration Number"
                  type="number"
                  value={memberInput.reg_no}
                  onChange={(e) =>
                    setMemberInput({
                      ...memberInput,
                      reg_no: Number(e.target.value),
                    })
                  }
                />
                <select
                  value={memberInput.gender}
                  onChange={(e) =>
                    setMemberInput({ ...memberInput, gender: e.target.value })
                  }
                  className="mb-2 w-full p-2 border rounded"
                >
                  <option value="">Select Gender</option>
                  <option value="M">M</option>
                  <option value="F">F</option>
                </select>
                <Button
                  onClick={handleAddMemberBefore}
                  className="cursor-pointer"
                >
                  Add Member
                </Button>
              </div>

              <div className="mt-1 text-sm mx-20 mb-6">
                <h3 className="text-lg font-semibold text-left">Member List</h3>
                <ul className=" mt-4">
                  {members.map((m) => (
                    <li key={m.reg_no} className="text-md my-2 font-semibold">
                      {m.name} ({m.gender}) - {m.reg_no}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Button
              onClick={handleCreateTeam}
              className="w-1/2 mt-10 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
              ) : (
                "Create Team"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
