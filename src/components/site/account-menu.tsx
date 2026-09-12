import { ChevronDown, LogOut, Monitor, Settings, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "./locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }
  return (parts[0]?.slice(0, 1) || "?").toUpperCase();
}

export function AccountAvatar({
  name,
  avatarUrl,
  size = 28,
}: {
  name: string;
  avatarUrl: string | null;
  size?: number;
}) {
  const [broken, setBroken] = useState(false);
  if (avatarUrl && !broken) {
    return (
      <img
        className="account-avatar-img"
        src={avatarUrl}
        alt=""
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
      />
    );
  }
  return (
    <span className="account-avatar-fallback" aria-hidden="true">
      {initials(name)}
    </span>
  );
}

export function AccountMenu() {
  const { locale, en, t } = useLocale();
  const auth = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const onApp = pathname === `/${locale}/app` || pathname.startsWith(`/${locale}/app/`);
  const onAccount = pathname === `/${locale}/account` || pathname.startsWith(`/${locale}/account/`);
  const label = auth.name || auth.email || (en ? "Account" : "账号");

  if (!mounted) {
    return null;
  }

  if (!auth.userId) {
    if (onApp || onAccount) {
      return (
        <button
          type="button"
          className="site-button small"
          onClick={() => void auth.signInWithGoogle()}
          disabled={auth.signingIn}
        >
          {auth.signingIn ? t("正在登录") : t("用 Google 登录")}
        </button>
      );
    }
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="account-trigger"
          aria-label={en ? "Account menu" : "账号菜单"}
        >
          <AccountAvatar name={label} avatarUrl={auth.avatarUrl} />
          <span className="account-trigger-name">{auth.name || auth.email}</span>
          <ChevronDown size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="account-menu" sideOffset={8}>
        <div className="account-menu-head">
          <AccountAvatar name={label} avatarUrl={auth.avatarUrl} size={36} />
          <div>
            <b>{auth.name || (en ? "Signed in" : "已登录")}</b>
            {auth.email ? <span>{auth.email}</span> : null}
          </div>
        </div>
        <DropdownMenuSeparator />
        {!onApp ? (
          <DropdownMenuItem asChild>
            <a href={`/${locale}/app`}>
              <Monitor size={15} />
              {t("我的设备")}
            </a>
          </DropdownMenuItem>
        ) : null}
        {!onAccount ? (
          <DropdownMenuItem asChild>
            <a href={`/${locale}/account`}>
              <Settings size={15} />
              {en ? "Account settings" : "账号设置"}
            </a>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem disabled>
            <UserRound size={15} />
            {en ? "Account settings" : "账号设置"}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void auth.signOut()}>
          <LogOut size={15} />
          {t("退出登录")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
