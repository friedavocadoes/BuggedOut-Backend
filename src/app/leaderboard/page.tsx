"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react"; // For a loading spinner

export default function Leaderboard() {
  const [teams, setTeams] = useState<{ teamName: string; score: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BD_URL}/api/teams/leaderboard`)
      .then((res) => {
        setTeams(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false)); // Handle errors gracefully
  }, []);

  return (
    <div className="p-6 flex flex-col items-center bg-white min-h-screen dark:bg-zinc-400 pt-40">
      {/* Leaderboard Header */}
      <Card className="w-full max-w-4xl mb-8 bg-white shadow-lg ">
        <CardHeader>
          <CardTitle className="text-center text-4xl md:text-5xl font-extrabold text-black">
            🏆 Leaderboard 🏆
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-lg md:text-2xl text-gray-700">
            Celebrate the top-performing teams!
          </p>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <Loader2 className="animate-spin text-indigo-700 w-16 h-16" />
          <p className="text-indigo-700 text-lg mt-4">Loading leaderboard...</p>
        </div>
      ) : teams.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <p className="text-gray-700 text-2xl">
            No teams have submitted scores yet!
          </p>
        </div>
      ) : (
        // Leaderboard Table
        <Card className="w-full max-w-4xl bg-white shadow-lg border border-indigo-200">
          {/* <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
              Team Rankings
            </CardTitle>
          </CardHeader> */}
          <CardContent>
            <Table className="text-lg md:text-xl">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4 text-left">Rank</TableHead>
                  <TableHead className="w-1/2 text-left">Team Name</TableHead>
                  <TableHead className="w-1/4 text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team, index) => (
                  <TableRow
                    key={index}
                    className={`${
                      index === 0
                        ? "bg-amber-300"
                        : index === 1
                        ? "bg-zinc-400"
                        : index === 2
                        ? "bg-stone-400"
                        : "bg-gray-100"
                    }`}
                  >
                    <TableCell className="text-left font-semibold">
                      #{index + 1}
                    </TableCell>
                    <TableCell className="text-left font-semibold">
                      {team.teamName}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {team.score}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
