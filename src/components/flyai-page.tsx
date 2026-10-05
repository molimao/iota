import { useQuery } from "@tanstack/react-query";
import { Cpu, ArrowUpRight } from "lucide-react";
import { getFlyaiMonth } from "@/lib/flyai.functions";
import { PROJECTS } from "@/lib/projects";
import { LANGUAGE_TAG } from "@/lib/site";
import { projectsCopy } from "./projects-copy";
import { fleetCopy } from "./fleet-copy";
import { useLocale } from "./site/locale";

const text = {
  zh: {
    total: "本月总积分",
    wallets: "公开钱包数",
    period: "积分月份",
    wallet: "公开 ETH 收益地址",
    scope: "积分按钱包、按月汇总；不能据此判断单台设备在线状态，也不等于今日收益或可提现金额。",
    step: "在 fly.ai 官方 Compute 页面配置计算任务，再复制 0x 开头的公开收益地址。添加设备时选择 fly.ai，粘贴该地址。",
  },
  "zh-TW": {
    total: "本月總積分",
    wallets: "公開錢包數",
    period: "積分月份",
    wallet: "公開 ETH 收益地址",
    scope: "積分按錢包、按月彙總；無法據此判斷單台設備在線狀態，也不等於今日收益或可提領金額。",
    step: "在 fly.ai 官方 Compute 頁面設定計算任務，再複製 0x 開頭的公開收益地址。新增設備時選擇 fly.ai，貼上該地址。",
  },
  en: {
    total: "Monthly total points",
    wallets: "Public wallets",
    period: "Points month",
    wallet: "Public ETH reward address",
    scope:
      "Points are monthly wallet totals. They do not establish device online status, daily earnings or a withdrawable amount.",
    step: "Configure compute on the official fly.ai Compute page, then copy your public reward address starting with 0x. Select fly.ai when adding a device and paste that address.",
  },
  ko: {
    total: "월간 총 포인트",
    wallets: "공개 지갑 수",
    period: "포인트 집계 월",
    wallet: "공개 ETH 보상 주소",
    scope:
      "포인트는 지갑별 월간 합계입니다. 개별 기기의 온라인 상태, 일일 수익 또는 출금 가능 금액을 의미하지 않습니다.",
    step: "공식 fly.ai Compute 페이지에서 작업을 설정한 뒤 0x로 시작하는 공개 보상 주소를 복사하세요. 기기 추가에서 fly.ai를 선택하고 주소를 붙여 넣으세요.",
  },
  ja: {
    total: "月間総ポイント",
    wallets: "公開ウォレット数",
    period: "ポイント集計月",
    wallet: "公開 ETH 報酬アドレス",
    scope:
      "ポイントはウォレット別の月間合計です。デバイスのオンライン状態、日次収益、出金可能額を示すものではありません。",
    step: "公式 fly.ai Compute ページで計算を設定し、0xで始まる公開報酬アドレスをコピーします。デバイス追加で fly.ai を選択し、アドレスを貼り付けてください。",
  },
};

export function FlyaiPage() {
  const { locale } = useLocale(),
    c = projectsCopy[locale],
    f = fleetCopy(locale),
    t = text[locale];
  const query = useQuery({
    queryKey: ["fleet", "flyai", "month"],
    queryFn: () => getFlyaiMonth(),
    staleTime: 60000,
    refetchInterval: 60000,
    retry: 1,
  });
  const result = query.data,
    data = result?.data;
  const now = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  const month = `${now.find((p) => p.type === "year")?.value}-${now.find((p) => p.type === "month")?.value}`;
  const stale = result?.stale || (data && data.month !== month);
  return (
    <main className="projects-page flyai-page">
      <header className="project-heading">
        <div>
          <a className="project-back" href={`/${locale}/projects`}>
            ← {c.back}
          </a>
          <span className="eyebrow">{c.compute} · fly.ai</span>
          <h1>fly.ai Compute</h1>
          <p>{c.flyai}</p>
        </div>
        <div className="project-heading-links">
          <a className="site-button" href={`/${locale}/devices?project=flyai`}>
            <Cpu size={17} />
            {f.title}
          </a>
          <a href={PROJECTS.flyai.website} target="_blank" rel="noreferrer">
            {c.website}
            <ArrowUpRight size={16} />
          </a>
        </div>
      </header>
      <section
        className="project-network flyai-network"
        id="network"
        aria-labelledby="flyai-network"
      >
        <div className="project-section-head">
          <h2 id="flyai-network">{c.network}</h2>
          <button
            className="project-outline"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            {query.isFetching ? c.refreshing : c.refresh}
          </button>
        </div>
        <p className="project-freshness">
          {c.fetched} ·{" "}
          {result?.fetchedAt
            ? new Date(result.fetchedAt).toLocaleString(LANGUAGE_TAG[locale], {
                timeZone: "Asia/Hong_Kong",
                hour12: false,
              })
            : "—"}{" "}
          (UTC+8) {stale ? ` · ${c.cached}` : ""}
        </p>
        {(result?.error || query.isError) && <p role="status">{c.failed}</p>}
        <div className="project-stats">
          <div className="project-stat">
            <span>{t.period}</span>
            <strong>{data?.month ?? "—"}</strong>
          </div>
          <div className="project-stat">
            <span>{t.total}</span>
            <strong>{data ? data.totalPoints.toLocaleString(LANGUAGE_TAG[locale]) : "—"}</strong>
          </div>
          <div className="project-stat">
            <span>{t.wallets}</span>
            <strong>{data ? data.wallets.length.toLocaleString(LANGUAGE_TAG[locale]) : "—"}</strong>
          </div>
        </div>
        <p>{t.scope}</p>
      </section>
      <section className="project-panel flyai-panel" id="setup">
        <h2>{c.setup}</h2>
        <h3 id="addresses">{t.wallet}</h3>
        <p>{t.step}</p>
        <a className="site-button" href={`/${locale}/devices?project=flyai`}>
          {c.open}
          <ArrowUpRight size={16} />
        </a>
      </section>
      <section className="project-panel flyai-panel">
        <h2>{c.sources}</h2>
        <p>{t.scope}</p>
        <div className="project-sources">
          <a href={PROJECTS.flyai.website} target="_blank" rel="noreferrer">
            {c.website}
          </a>
          <a href={PROJECTS.flyai.explorer} target="_blank" rel="noreferrer">
            fly.ai · /api/month
          </a>
        </div>
      </section>
    </main>
  );
}
