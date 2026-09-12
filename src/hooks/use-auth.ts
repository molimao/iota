import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export type AuthState = {
  userId: string | null;
  email: string | null;
  ready: boolean;
  signingIn: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

export function useAuth(): AuthState {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
      setEmail(session?.user?.email ?? null);
      setReady(true);
    });
    void supabase.auth.getSession().then(({ data: current }) => {
      setUserId(current.session?.user?.id ?? null);
      setEmail(current.session?.user?.email ?? null);
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    setSigningIn(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
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
    setUserId(null);
    setEmail(null);
  }, []);

  return { userId, email, ready, signingIn, error, signInWithGoogle, signOut };
}
