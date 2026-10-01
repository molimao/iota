import type { User } from "@supabase/supabase-js";

export type AuthProfile = {
  userId: string | null;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
};

function firstText(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

export function profileFromUser(user: User | null): AuthProfile {
  if (!user) return { userId: null, email: null, name: null, avatarUrl: null };
  const meta = user.user_metadata ?? {};
  const email = firstText(user.email);
  return {
    userId: user.id,
    email,
    name: firstText(
      meta["full_name"],
      meta["name"],
      meta["preferred_username"],
      email?.split("@")[0],
    ),
    avatarUrl: firstText(meta["avatar_url"], meta["picture"]),
  };
}
