# AdSense candidate — 2026-10-12

Owner requested AdSense with Pro ad-free. Existing account pub-5017554552450609 read from signed-in QQ browser. Added iotahome.site to Sites; visible status “需要审核”. No ownership verification or review request submitted because the verification file is not live. No production deployment.

- Local public/ads.txt contains the exact account line supplied by AdSense.
- Manual ad component at the shared footer, eligible only for individual /learn/ and /blog/ articles. Monitoring, checkout, account, privacy, listings and preview routes are excluded.
- Anonymous users wait for session initialization. Signed-in users wait for verified billing. Pro (including trialing) never loads the ad tag. Failed billing hides ads. DNT/GPC also suppress loading.
- Upgrade after an ad request reloads the document to discard the third-party runtime. No ad auto-refresh. Auto ads MUST remain disabled in AdSense; do not inject its script globally.
- Five-language ad label, privacy disclosure and Pro ad-free benefit.
- VITE_ADSENSE_ENABLED remains false. Public client ID recorded in example only; content ad unit ID still needed. No live ad requests or test clicks.

Before activation: publish verification file with per-release approval, verify site, request review, obtain approval; create dedicated responsive content ad unit and configure slot; configure applicable regional privacy/CMP requirements (https://support.google.com/adsense/answer/13554116), validate free/Pro/trial account transitions in browser with mocked ads, then separately approve live activation. Do not treat default-on analytics as consent to personalized advertising.

## Automatic ads supersede manual placement (2026-10-12)

Owner explicitly requested all formats across the site. AdSense dashboard saved Auto ads enabled, zero page exclusions; overlay 3/3, in-page 2/2, intent-driven 1/1 with all three suboptions checked. Other sites were not changed. Site remains under review.

Local code now mounts a membership-gated Auto ads loader at the root, without manual slots or refresh. All localized public pages are eligible; local review preview excluded. Pro/trial and unresolved/failed membership stay ad-free. Loaded runtime triggers full navigation on identity/eligibility change to discard injected ads. VITE_ADSENSE_ENABLED remains false pending site approval, regional privacy setup and a separately approved website rollout. Auto ads changes are saved in Google; this code update has not been published.
