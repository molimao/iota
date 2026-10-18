import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { setAgentAnalysisLocale } from "@/lib/device-agent.functions";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "./site/locale";
/** Persist the website language for analysis while the browser is closed. */
export function AgentAnalysisLanguage() {
  const auth = useAuth(),
    { locale } = useLocale(),
    save = useServerFn(setAgentAnalysisLocale);
  useEffect(() => {
    if (auth.userId) void save({ data: { locale } }).catch(() => {});
  }, [auth.userId, locale, save]);
  return null;
}
