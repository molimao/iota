# AdSense candidate — 2026-10-12

Owner requested AdSense with Pro ad-free. Existing account pub-5017554552450609 read from signed-in QQ browser. Added iotahome.site to Sites; visible status “需要审核”. No ownership verification or review request submitted because the verification file is not live. No production deployment.

- Local public/ads.txt contains the exact account line supplied by AdSense.
- Manual ad component at the shared footer, eligible only for individual /learn/ and /blog/ articles. Monitoring, checkout, account, privacy, listings and preview routes are excluded.
- Anonymous users wait for session initialization. Signed-in users wait for verified billing. Pro (including trialing) never loads the ad tag. Failed billing hides ads. DNT/GPC also suppress loading.
- Upgrade after an ad request reloads the document to discard the third-party runtime. No ad auto-refresh. Auto ads MUST remain disabled in AdSense; do not inject its script globally.
- Five-language ad label, privacy disclosure and Pro ad-free benefit.
- VITE_ADSENSE_ENABLED remains false. Public client ID recorded in example only; content ad unit ID still needed. No live ad requests or test clicks.

Before activation: publish verification file with per-release approval, verify site, request review, obtain approval; create dedicated responsive content ad unit and configure slot; configure applicable regional privacy/CMP requirements (https://support.google.com/adsense/answer/13554116), validate free/Pro/trial account transitions in browser with mocked ads, then separately approve live activation. Do not treat default-on analytics as consent to personalized advertising.
