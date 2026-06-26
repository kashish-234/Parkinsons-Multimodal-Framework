import { supabase } from "./supabase";
import { useEffect, useState } from "react";

export type UserRole = "researcher" | "admin" | null;

export async function getUserRole(): Promise<UserRole> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return (profile?.role as UserRole) ?? null;
}

export function useRole() {
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    getUserRole().then(setRole);
  }, []);

  return role;
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.replace("/");
}