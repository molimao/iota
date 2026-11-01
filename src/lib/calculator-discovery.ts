import { localized as l } from "./product-discovery";
import { calculatorCopy } from "../components/hardware-calculator-copy";
import { HARDWARE_CATALOG, calculatorModels } from "./hardware-catalog";
import { hardwareLabel, type CalculatorProject } from "./hardware-yield";
import { PROJECTS } from "./projects";
import { ORIGIN, LOCALES, LANGUAGE_TAG, type SiteLocale } from "./site";
const descriptions = {
  iota: l([
    "选择 Mac 配置和运行时间，查看 IOTA 匿名设备样本的日均收入。统计包含排队和零收益日。",
    "選擇 Mac 配置與執行時間，查看 IOTA 匿名設備樣本的日均收入。統計包含排隊與零收益日。",
    "Choose a Mac configuration and hours to explore IOTA daily income from anonymous device samples, including queueing and zero-income days.",
    "Mac 구성과 시간을 선택해 익명 기기 샘플의 IOTA 일평균 수익을 확인하세요. 대기 및 수익이 없는 날을 포함합니다.",
    "Mac構成と稼働時間を選び、匿名端末のIOTA日平均収入を確認。待機と無収益の日を含みます。",
  ]),
  bnt: l([
    "选择 M4 Max 或 RTX 5090，按 Seine 实测算力与当前 Blocknet 网络估算每日 BNT 收入。美元估值采用 $0.16 固定参考价。",
    "選擇 M4 Max 或 RTX 5090，按 Seine 實測算力與目前 Blocknet 網路估算每日 BNT 收入。美元估值採 $0.16 固定參考價。",
    "Estimate daily Blocknet BNT revenue for M4 Max or RTX 5090 using measured Seine hashrate and current network data, valued at a fixed $0.16 reference.",
    "M4 Max 또는 RTX 5090의 Seine 실측값과 현재 네트워크로 Blocknet BNT 일일 수익을 계산합니다. 달러 환산은 $0.16 고정 참고가입니다.",
    "M4 MaxまたはRTX 5090のSeine実測と現在のネットワークからBlocknet BNTの日収益を計算。ドル換算は固定参考価格$0.16。",
  ]),
  prl: l([
    "选 RTX 显卡和每天运行时长，比较 PearlHash 挖矿的 PRL 收入、美元估值和电费。",
    "選 RTX 顯卡與每天執行時間，比較 PearlHash 挖礦的 PRL 收入、美元估值與電費。",
    "Choose an RTX GPU and daily hours to estimate PearlHash mining revenue in PRL and USD, with electricity costs shown separately.",
    "RTX GPU와 일일 시간을 선택해 PearlHash의 PRL·달러 수익과 전기요금을 계산하세요.",
    "RTX GPUと1日の稼働時間を選び、PearlHashのPRL収益・ドル換算・電気代を確認。",
  ]),
  quantus: l([
    "用 RTX 显卡的 Poseidon2 参考数据估算 Quantus 每日 QTC 收入，按运行时长和电价比较收益。",
    "用 RTX 顯卡的 Poseidon2 參考資料估算 Quantus 每日 QTC 收入，按執行時間與電價比較收益。",
    "Estimate Quantus QTC daily revenue from RTX Poseidon2 reference data, then adjust operating hours and electricity prices.",
    "RTX Poseidon2 참고 데이터로 Quantus QTC 일일 수익을 계산하고 가동 시간과 전기요금을 조정하세요.",
    "RTXのPoseidon2参考データからQuantus QTCの日収益を予測。稼働時間と電気料金を調整できます。",
  ]),
  rvn: l([
    "选择 RTX 显卡，按 KawPow 参考数据估算 Ravencoin 每日 RVN 收入，查看扣电费前后的美元收益。",
    "選擇 RTX 顯卡，按 KawPow 參考資料估算 Ravencoin 每日 RVN 收入，查看扣電費前後的美元收益。",
    "Estimate Ravencoin RVN daily revenue using RTX KawPow reference data and compare USD returns before and after electricity.",
    "RTX KawPow 참고값으로 Ravencoin RVN 일일 수익과 전기요금 차감 전후 달러 수익을 확인하세요.",
    "RTXのKawPow参考データでRavencoin RVNの日収益を計算。電気代控除前後のドル収益を比較。",
  ]),
  erg: l([
    "选择 RTX 显卡，按 Autolykos 参考数据估算 Ergo 每日 ERG 收入，电费和净收益分别展示。",
    "選擇 RTX 顯卡，按 Autolykos 參考資料估算 Ergo 每日 ERG 收入，電費與淨收益分開顯示。",
    "Estimate Ergo ERG daily revenue using RTX Autolykos reference data, with electricity and net returns displayed separately.",
    "RTX Autolykos 참고값으로 Ergo ERG 일일 수익을 계산하고 전기요금과 순수익을 따로 확인하세요.",
    "RTXのAutolykos参考データでErgo ERGの日収益を計算。電気代と純収益を別々に表示。",
  ]),
  ethw: l([
    "用 RTX 显卡的 Ethash 参考数据估算 EthereumPoW 每日 ETHW 收入，可调整运行时长和电价。",
    "用 RTX 顯卡的 Ethash 參考資料估算 EthereumPoW 每日 ETHW 收入，可調整執行時間與電價。",
    "Estimate EthereumPoW ETHW daily revenue from RTX Ethash reference data, with adjustable hours and electricity prices.",
    "RTX Ethash 참고 데이터로 EthereumPoW ETHW 일일 수익을 계산하고 시간과 전기요금을 조정하세요.",
    "RTXのEthash参考データからEthereumPoW ETHWの日収益を予測。稼働時間と電気料金を調整できます。",
  ]),
} satisfies Record<CalculatorProject, ReturnType<typeof l>>;
const mainDescription = l([
  "在一页选择 IOTA、Blocknet BNT、Pearl PRL、Quantus、RVN、ERG 或 ETHW，搭配 RTX 或 Mac 设备和运行时间查看收益参考。",
  "在同一頁選擇 IOTA、Blocknet BNT、Pearl PRL、Quantus、RVN、ERG 或 ETHW，搭配 RTX 或 Mac 設備與執行時間查看收益參考。",
  "Explore IOTA, Blocknet BNT, Pearl PRL, Quantus, RVN, ERG and ETHW in one calculator. Choose an RTX or Mac device and daily hours.",
  "하나의 계산기에서 IOTA, Blocknet BNT, Pearl PRL, Quantus, RVN, ERG, ETHW를 선택하고 RTX·Mac 기기와 가동 시간으로 수익을 확인하세요.",
  "IOTA、Blocknet BNT、Pearl PRL、Quantus、RVN、ERG、ETHWを1つの計算機で。RTX・Macと稼働時間を選べます。",
]);
export function calculatorDescription(locale: SiteLocale, project?: CalculatorProject) {
  return project ? descriptions[project][locale] : mainDescription[locale];
}
export function calculatorHead(locale: SiteLocale, project?: CalculatorProject) {
  const path = `calculator${project ? "/" + project : ""}`;
  const url = `${ORIGIN}/${locale}/${path}`;
  const models = calculatorModels(project);
  const featured = models
    .filter((m) => m.startsWith("m") || m === "4090" || m === "5090")
    .map(hardwareLabel)
    .join(" / ");
  const unit = project
    ? HARDWARE_CATALOG.flatMap((s) => s.rows).find((r) => r.project === project)!.unit
    : "";
  const name = project
    ? PROJECTS[project].name + (PROJECTS[project].name === unit ? "" : ` ${unit}`)
    : "RTX / Mac";
  const title = `${name} · ${calculatorCopy.entry[locale]}${project ? " · " + featured : ""} | IOTA Watch`;
  const description = calculatorDescription(locale, project);
  const breadcrumbs = [
    {
      "@type": "ListItem",
      position: 1,
      name: calculatorCopy.entry[locale],
      item: `${ORIGIN}/${locale}/calculator`,
    },
  ];
  if (project)
    breadcrumbs.push({ "@type": "ListItem", position: 2, name: PROJECTS[project].name, item: url });
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [
      { rel: "canonical", href: url },
      ...LOCALES.map((l) => ({
        rel: "alternate",
        hrefLang: LANGUAGE_TAG[l],
        href: `${ORIGIN}/${l}/${path}`,
      })),
      { rel: "alternate", hrefLang: "x-default", href: `${ORIGIN}/en/${path}` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: title,
              url,
              description,
              inLanguage: LANGUAGE_TAG[locale],
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Web",
              isAccessibleForFree: true,
            },
            { "@type": "BreadcrumbList", itemListElement: breadcrumbs },
          ],
        }).replace(/</g, "\\u003c"),
      },
    ],
  };
}
