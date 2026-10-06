import { withDeadline } from "@/lib/deadline";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "./site/locale";
import { projectRequestCopy } from "./project-request-copy";
import { projectRequestSchema, type ProjectRequestResult } from "@/lib/project-request";
import { getProjectRequestStatus, submitProjectRequest } from "@/lib/project-request.functions";
import { hongKongDayStartSeconds } from "@/lib/earnings";
export function ProjectRequest({
  preview = false,
  defaultOpen = false,
}: {
  preview?: boolean;
  defaultOpen?: boolean;
}) {
  const { locale } = useLocale(),
    c = projectRequestCopy(locale),
    auth = useAuth(),
    client = useQueryClient();
  const demo = preview && import.meta.env.DEV;
  const [open, setOpen] = useState(defaultOpen),
    [name, setName] = useState(""),
    [url, setUrl] = useState(""),
    [description, setDescription] = useState(""),
    [busy, setBusy] = useState(false),
    [result, setResult] = useState<ProjectRequestResult | null>(null),
    [error, setError] = useState<string | null>(null);
  const requestId = useRef("");
  const identity = useRef(auth.userId);
  identity.current = auth.userId;
  const read = useServerFn(getProjectRequestStatus),
    submit = useServerFn(submitProjectRequest);
  const key = ["project-request-status", auth.userId, hongKongDayStartSeconds()];
  const status = useQuery({
    queryKey: key,
    queryFn: () => withDeadline(read(), 15000, "request_unavailable"),
    enabled: open && !demo && !!auth.userId,
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1,
  });
  useEffect(() => {
    requestId.current = crypto.randomUUID();
    setName("");
    setUrl("");
    setDescription("");
    setResult(null);
    setError(null);
  }, [auth.userId]);
  const allowed = demo || !!auth.userId;
  const now = Date.now();
  const used =
    (result?.status === "daily-limit" && !!result.nextAt && Date.parse(result.nextAt) > now) ||
    (status.data?.canSubmit === false && Date.parse(status.data.nextAt) > now);
  useEffect(() => {
    if (open && result?.nextAt && Date.parse(result.nextAt) <= Date.now()) {
      setResult(null);
      requestId.current = crypto.randomUUID();
    }
  }, [open, result, status.data]);
  async function send() {
    if (busy || !allowed || used) return;
    const parsed = projectRequestSchema.safeParse({
      requestId: requestId.current,
      name,
      url,
      description,
      locale,
    });
    if (!parsed.success) {
      const field = parsed.error.issues[0]?.path[0];
      setError(
        field === "name"
          ? c.invalidName
          : field === "url"
            ? c.invalidUrl
            : field === "description"
              ? c.invalidDescription
              : c.failed,
      );
      return;
    }
    const owner = auth.userId;
    setError(null);
    setBusy(true);
    try {
      const r = demo
        ? { status: "submitted" as const, nextAt: null }
        : await withDeadline(submit({ data: parsed.data }), 15000, "request_unavailable");
      if (identity.current !== owner) return;
      if (r.status === "unavailable") {
        setError(c.failed);
        return;
      }
      setResult(r);
      if (!demo)
        await client.invalidateQueries({ queryKey: ["project-request-status", auth.userId] });
    } catch {
      setError(c.failed);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <button className="project-request-trigger" type="button" onClick={() => setOpen(true)}>
        {c.open}
      </button>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!busy) setOpen(value);
        }}
      >
        <DialogContent className="project-request-dialog">
          <DialogTitle>{c.title}</DialogTitle>
          <DialogDescription>{c.limit}</DialogDescription>
          {demo && <p className="project-request-preview">{c.preview}</p>}
          {!allowed ? (
            <button
              className="site-button"
              disabled={!auth.ready || auth.signingIn}
              onClick={() => void auth.signInWithGoogle()}
            >
              {c.signin}
            </button>
          ) : result?.status === "submitted" ? (
            <div role="status">
              <strong>{c.success}</strong>
              <p>{c.used}</p>
            </div>
          ) : used ? (
            <p role="status">{c.used}</p>
          ) : status.isPending && !demo && status.isFetching ? (
            <p role="status">{c.checking}</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
              noValidate
            >
              <label htmlFor="request-project-name">{c.name}</label>
              <input
                id="request-project-name"
                aria-invalid={error === c.invalidName}
                aria-describedby={error ? "project-request-error" : undefined}
                required
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                disabled={busy}
              />
              <label htmlFor="request-project-url">{c.url}</label>
              <input
                id="request-project-url"
                aria-invalid={error === c.invalidUrl}
                aria-describedby={error ? "project-request-error" : undefined}
                type="url"
                required
                maxLength={500}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://"
                autoComplete="off"
                spellCheck={false}
                disabled={busy}
              />
              <label htmlFor="request-project-description">{c.description}</label>
              <textarea
                id="request-project-description"
                aria-invalid={error === c.invalidDescription}
                aria-describedby={error ? "project-request-error" : undefined}
                maxLength={1000}
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={c.placeholder}
                disabled={busy}
              />
              {error && (
                <p id="project-request-error" role="alert" className="project-request-error">
                  {error}
                </p>
              )}
              <button
                className="site-button"
                type="submit"
                disabled={busy || !name.trim() || !url.trim()}
              >
                {busy ? c.busy : c.submit}
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
export function ProjectRequestFooter() {
  return (
    <footer className="project-request-footer">
      <ProjectRequest />
    </footer>
  );
}
