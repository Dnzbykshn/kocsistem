import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LeaderboardScreen } from "./LeaderboardScreen";

export const metadata = { title: "Leaderboard — KocSistemBoard" };

export default async function LeaderboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <LeaderboardScreen />;
}
