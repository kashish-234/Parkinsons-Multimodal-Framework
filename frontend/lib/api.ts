import { auth } from "./firebase";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

async function authHeader() {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

export async function getMe() {
  const headers = await authHeader();
  const res = await fetch(`${API}/auth/me`, { headers });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function loginWithIdToken(idToken: string) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}