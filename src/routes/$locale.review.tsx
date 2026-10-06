import { PlatformPage } from "@/components/platform-page";
import { isPlatform } from "@/lib/platforms";
import { createFileRoute, notFound, useRouterState } from "@tanstack/react-router";
import { isLocale } from "@/lib/site";
import { FleetReview } from "@/components/fleet-review";

/** Local review only: the production build never exposes sample account data. */
export const Route = createFileRoute("/$locale/review")({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound();
  },
  head: ({ params }) => ({
    meta: [
      {
        title:
          {
            zh: "设备与付费版设计预览",
            en: "Devices and membership preview",
            "zh-TW": "設備與會員設計預覽",
            ko: "기기 및 멤버십 미리보기",
            ja: "デバイスとメンバーシップのプレビュー",
          }[isLocale(params.locale) ? params.locale : "zh"] + " · IOTA Watch",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Review,
});

function Review() {
  const p = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).get("platform"),
  });
  return isPlatform(p) ? <PlatformPage key={p} project={p} demo /> : <FleetReview />;
}
