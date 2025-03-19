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

export default function Leaderboard() {
  const [teams, setTeams] = useState<{ teamName: string; score: number }[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/teams/leaderboard")
      .then((res) => setTeams(res.data));
  }, []);

  return (
    <div className="p-6 flex flex-col items-center">
      {/* Leaderboard Header */}
      <Card className="w-full max-w-4xl mb-6">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-indigo-600">
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            Check out the top-performing teams and their scores!
          </p>
        </CardContent>
      </Card>

      {/* Leaderboard Table */}
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Team Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4 text-left">Rank</TableHead>
                <TableHead className="w-1/2 text-left">Team Name</TableHead>
                <TableHead className="w-1/4 text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team, index) => (
                <TableRow key={index}>
                  <TableCell className="text-left">#{index + 1}</TableCell>
                  <TableCell className="text-left">{team.teamName}</TableCell>
                  <TableCell className="text-right">{team.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
