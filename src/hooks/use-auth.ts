import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { profileFromUser, type AuthProfile } from "@/lib/auth-profile";

export type { AuthProfile } from "@/lib/auth-profile";
export { profileFromUser } from "@/lib/auth-profile";

export type AuthState = AuthProfile & {
  ready: boolean;
  signingIn: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const emptyProfile: AuthProfile = { userId: null, email: null, name: null, avatarUrl: null };

export function useAuth(): AuthState {
  const [profile, setProfile] = useState<AuthProfile>(emptyProfile);
  const [ready, setReady] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apply = (user: User | null) => {
      setProfile(profileFromUser(user));
      setReady(true);
    };
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      apply(session?.user ?? null);
    });
    void supabase.auth.getSession().then(({ data: current }) => {
      apply(current.session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    setSigningIn(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.href,
      });
      if (result.error) {
        setError("登录未完成，请重试。");
        return;
      }
      if (result.redirected) return;
    } catch {
      setError("登录未完成，请重试。");
    } finally {
      setSigningIn(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(emptyProfile);
  }, []);

  return { ...profile, ready, signingIn, error, signInWithGoogle, signOut };
}
