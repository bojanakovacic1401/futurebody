import type { User } from "@/types/user";

export const demoUser: User = {
  id: "demo-user-001",
  name: "Alex Morgan",
  email: "demo@futurebody.ai",
  provider: "demo",
};

export async function verifyPassword(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === demoUser.email && password === "demo123") {
    return demoUser;
  }

  return null;
}