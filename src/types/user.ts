export type AuthProvider = "demo" | "google";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider?: AuthProvider;
};