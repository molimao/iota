import type { BillingSummary } from "./plans";

export function adEligible(input: {
  enabled: boolean;
  hostname: string;
  pathname: string;
  client: string;
  authReady: boolean;
  userId: string | null;
  billingReady: boolean;
  billing?: BillingSummary | undefined;
  privacyBlocked: boolean;
}) {
  return (
    input.enabled &&
    ["iotahome.site", "www.iotahome.site"].includes(input.hostname) &&
    /^ca-pub-\d{16}$/.test(input.client) &&
    /^\/(zh|zh-TW|en|ko|ja)(?:\/|$)/.test(input.pathname) &&
    !/^\/(zh|zh-TW|en|ko|ja)\/review(?:\/|$)/.test(input.pathname) &&
    input.authReady &&
    !input.privacyBlocked &&
    (!input.userId || (input.billingReady && input.billing?.plan === "free"))
  );
}
export const adLabels = {
  zh: ["广告", "无广告浏览"],
  "zh-TW": ["廣告", "無廣告瀏覽"],
  en: ["Advertisement", "Ad-free browsing"],
  ko: ["광고", "광고 없는 이용"],
  ja: ["広告", "広告なしで利用"],
} as const;

export const adPrivacy = {
  zh: "免费用户浏览本站时可能看到 Google AdSense 广告。广告服务可能使用 Cookie、IP 地址及浏览器信息来投放广告、衡量效果和防止欺诈。Pro 及有效试用会员不展示广告。适用地区的广告隐私选择按 Google 的要求处理。",
  "zh-TW":
    "免費使用者瀏覽本站時可能看到 Google AdSense 廣告。廣告服務可能使用 Cookie、IP 位址及瀏覽器資訊投放廣告、衡量成效及防止詐欺。Pro 及有效試用會員不顯示廣告。適用地區的廣告隱私選擇依 Google 的要求處理。",
  en: "Free users may see Google AdSense ads across the website. The advertising service may use cookies, IP addresses and browser information to serve and measure ads and prevent fraud. Pro members and members with an active trial do not see ads. Advertising privacy choices in applicable regions follow Google’s requirements.",
  ko: "무료 사용자는 사이트에서 Google AdSense 광고를 볼 수 있습니다. 광고 서비스는 광고 제공, 성과 측정 및 사기 방지를 위해 쿠키, IP 주소와 브라우저 정보를 사용할 수 있습니다. Pro 및 유효한 무료 체험 회원에게는 광고를 표시하지 않습니다. 해당 지역의 광고 개인정보 선택은 Google 요구사항에 따라 처리됩니다.",
  ja: "無料ユーザーにはサイト内にGoogle AdSense広告が表示される場合があります。広告サービスは広告配信、効果測定、不正防止のためCookie、IPアドレス、ブラウザ情報を使用する場合があります。Pro会員と有効な無料体験中の会員には広告を表示しません。対象地域の広告に関するプライバシー選択はGoogleの要件に従います。",
} as const;
