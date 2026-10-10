# Daily Pro earnings email — inspection findings and guidance (read-only)

No files, database, DNS, schedules or settings were changed. No email was sent.

## 1. Current email status (checked live)

- Built-in app emails: **not set up**. Setup status is `not_started`.
- Sending domain: **none selected**. So there is no verification status and no enabled/disabled state yet.
- Repo: no email packages are installed (`@lovable.dev/email-js`, `@react-email/*` are missing). There is no `src/lib/email-templates/` folder and no email routes.
- The site's custom domain (iotahome.site) is **not** linked to email. The owner would choose it, or a subdomain such as `notify.iotahome.site`, in the email setup dialog. Lovable then delegates that subdomain with NS records shown in Cloud -> Emails.

## 2. Policy blocker to resolve first

Lovable app emails are only for one recipient, triggered by one specific action or event. The rules forbid scheduled digests and any cron or admin code that sends the same template to many users. A daily 09:30 earnings email to every opted-in Pro user is a scheduled digest sent to a list. That falls **outside** what built-in app emails support, even with opt-in and per-user data.

Supported options:
- **Event-triggered, per user** (allowed). Example: email one user when a specific event happens on their own device, such as a reward settling or a device changing to 需检查.
- **Daily digest** (not allowed). Use a dedicated email service the owner chooses instead. That would need its own provider API key in Secrets and must not use the same subdomain as Lovable Emails.

## 3. Supported app-email APIs (once a domain exists)

The setup order is fixed:
1. Run the email setup dialog.
2. Run the scaffold tool. It creates the template registry (`registry.ts`), the server-only send helper (`send-email.ts`) and the dashboard preview route `/lovable/email/transactional/preview`. It also installs the required packages.

Do not write these files by hand before scaffolding; the scaffold sets `SENDER_DOMAIN` and `FROM_DOMAIN`.

- **Template:** a `.tsx` file in `src/lib/email-templates/` that exports `template = { component, subject, displayName?, previewData?, to? } satisfies TemplateEntry` (`import type { TemplateEntry } from './registry'`). Register it in `TEMPLATES` in `registry.ts`. Use `@react-email/components` with inline styles only, a white body and no unsubscribe text.
- **Send (server code only):**
  ```ts
  import { sendTemplateEmail } from '@/lib/email-templates/send-email'
  const r = await sendTemplateEmail('template-name', recipientEmail, {
    templateData: { ... },
    idempotencyKey: `<event-id>-template-name`,
  })
  // r: { sent: true } | { sent: false, reason: 'recipient_suppressed' }
  ```
  The helper renders the template and calls `sendLovableEmail` from `@lovable.dev/email-js` synchronously, using the server-only `LOVABLE_API_KEY`.
- **Errors:** other failures throw `EmailAPIError` with `code` and `status`:
  - `domain_not_verified` or `emails_disabled`: these are server-side states. Wait for verification or re-enable emails; do not change code.
  - `429`: wait `retryAfterSeconds` (60 if null) before retrying.
- **Unsubscribe and suppression:** fully managed by Lovable.
  - The footer and the hosted unsubscribe page are added automatically and cannot be turned off.
  - Suppressed recipients (bounce, complaint, unsubscribe) come back as `recipient_suppressed`. Treat that as a normal skip.
  - Do not create unsubscribe tables, routes or queues.
  - Optional server-side reads and writes: `getEmailUnsubscribe` / `setEmailUnsubscribe` and `listEmailLogs` from `@lovable.dev/email-js`.
  - Optional bounce, complaint and unsubscribe webhook: `src/routes/lovable/email/events.ts` with `createEmailWebhookHandler`. It only receives events from the published site.
- An in-app opt-in toggle is still the app's own setting, stored in the database. Lovable's unsubscribe state always takes priority over it.

## 4. Scheduled server jobs without a browser open

- The database scheduler (`pg_cron` + `pg_net`) sends an HTTP POST to a TanStack server route under `src/routes/api/public/...`. It uses the stable production URL `https://project--5854fd0c-7c2c-425c-a833-b540ffe023bd.lovable.app/...`, so no user's browser needs to be open.
- Times are in UTC: 09:30 Asia/Shanghai = `30 1 * * *`.
- **Protection:** the repo already has the generated helper `authenticateCronRequest(request)` in `src/integrations/supabase/cron-auth.ts`.
  - It compares the Bearer token against the server-only secret `LOVABLE_CRON_SECRET`, with `LOVABLE_CRON_SECRET_PREVIOUS` allowed during rotation.
  - It returns `null` when the token matches, otherwise a 401 or 500 response.
  - Call it first in the handler.
  - This inspection did not confirm whether that secret is currently set.
- The publishable key alone is **not** authentication. Any job that sends email or reads private data must check a server-only secret like this.
- The job's SQL contains the project URL and token, so it is created with a one-off SQL run, not a migration. Nothing has been scheduled.

## Recommended next step (needs owner decision)

Pick one:
- A. Switch to event-triggered per-user emails using built-in app emails. This needs domain setup, then scaffolding, then implementation.
- B. Keep the 09:30 daily digest using a separate email provider the owner chooses.

After that, the owner should confirm any production release separately.
