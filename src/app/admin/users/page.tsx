import { getTeamUsers } from "@/features/users/actions";
import { TeamClient } from "./team-client";

export const metadata = {
  title: "Team & Permissions — Admin",
  description: "Manage administrative staff, granular role permissions, and system access levels in Supabase.",
};

export default async function AdminUsersPage() {
  const users = await getTeamUsers();

  return <TeamClient initialUsers={users} />;
}
