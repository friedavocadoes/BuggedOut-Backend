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
import { Loader2 } from "lucide-react";
import { BackgroundLines } from "@/components/ui/background-lines";

export default function Leaderboard() {
  const [teams, setTeams] = useState<
    { teamName: string; score: number; blacklisted: boolean }[]
  >([]);
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
    <BackgroundLines className="flex items-center justify-center w-full flex-col h-full">
      {/* <div className="p-6 flex flex-col items-center min-h-screen  pt-40"> */}
      {/* Leaderboard Header */}
      <Card className="w-full max-w-4xl mb-8 bg-neutral-100/5 backdrop-blur-sm border-zinc-600 mt-30">
        <CardHeader>
          <CardTitle className="text-center text-2xl md:text-4xl font-extrabold text-zinc-400">
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-lg md:text-xl text-zinc-500 -mt-5">
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
        <Card className="w-full max-w-4xl bg-neutral-100/5 backdrop-blur-sm border-zinc-600 mb-10">
          <CardContent>
            <Table className="text-lg md:text-xl">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4 text-left text-neutral-400 text-2xl font-bold pb-4">
                    {" "}
                    Rank
                  </TableHead>
                  <TableHead className="w-1/2 text-left text-neutral-400 text-2xl font-bold pb-4">
                    {" "}
                    Team Name
                  </TableHead>
                  <TableHead className="w-1/4 text-right text-neutral-400 text-2xl font-bold pb-4">
                    Score
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-zinc-300">
                {teams.map((team, index) => (
                  <TableRow
                    key={index}
                    className={`${
                      index === 0
                        ? "text-yellow-500"
                        : index === 1
                        ? "text-green-500"
                        : index === 2
                        ? "text-teal-500"
                        : ""
                    } ${team.blacklisted && "line-through bg-red-900"}`}
                  >
                    <TableCell className="text-left font-medium py-4">
                      #{index + 1}
                    </TableCell>
                    <TableCell className="text-left font-medium py-4">
                      {team.teamName}
                    </TableCell>
                    <TableCell className="text-right font-medium py-4">
                      {team.score}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      {/* </div> */}
    </BackgroundLines>
  );
}
