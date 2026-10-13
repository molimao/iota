import { authCallbackIssue, authReturnUrl, type AuthIssue } from "@/lib/auth-errors";
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

let startupIssue: AuthIssue | null | undefined;

const emptyProfile: AuthProfile = { userId: null, email: null, name: null, avatarUrl: null };

export function useAuth(): AuthState {
  const [profile, setProfile] = useState<AuthProfile>(emptyProfile);
  const [ready, setReady] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startupIssue ??= authCallbackIssue(window.location.hash, window.location.search);
    if (startupIssue) setError(startupIssue);
    let active = true;
    const timer = window.setTimeout(() => {
      if (!active) return;
      setError(startupIssue ?? "login_unavailable");
      setReady(true);
    }, 12000);
    const apply = (user: User | null) => {
      if (!active) return;
      window.clearTimeout(timer);
      if (user) setError(null);
      setProfile(profileFromUser(user));
      setReady(true);
    };
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      apply(session?.user ?? null);
    });
    void supabase.auth
      .getSession()
      .then(({ data: current, error: sessionError }) => {
        if (sessionError && active) setError(startupIssue ?? "login_unavailable");
        apply(current.session?.user ?? null);
      })
      .catch(() => {
        if (active) {
          window.clearTimeout(timer);
          setError(startupIssue ?? "login_unavailable");
          setReady(true);
        }
      });
    return () => {
      active = false;
      window.clearTimeout(timer);
      data.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    setSigningIn(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: authReturnUrl(window.location.href),
      });
      if (result.error) {
        setError("login_failed");
        return;
      }
      if (result.redirected) return;
    } catch {
      setError("login_failed");
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
