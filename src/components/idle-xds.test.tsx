import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, it } from "vitest";
import { IdleXdsSettings } from "./idle-xds";
import { idleMiningCopy } from "./idle-bnt";
import { operationsReviewData } from "./operations-review-data";
import { LocaleContext } from "./site/locale";

it("starts XDS disabled and automatically prepares every selected Mac in all five languages", () => {
  const data = operationsReviewData(Date.now());
  for (const locale of ["zh", "zh-TW", "en", "ko", "ja"] as const) {
    const html = renderToStaticMarkup(
      <LocaleContext.Provider value={locale}>
        <QueryClientProvider client={new QueryClient()}>
          <IdleXdsSettings
            copy={idleMiningCopy}
            userId={null}
            preview
            machines={data.devices.map((device) => ({ device, agent: data.agents[device.id]! }))}
          />
        </QueryClientProvider>
      </LocaleContext.Provider>,
    );
    expect(html).toContain('value="0" selected=""');
    expect(html.match(/<select /g)).toHaveLength(2);
    expect(html).toContain('value="4"');
    expect(html).not.toContain("Mining BNT");
    expect(html).not.toContain("正在挖 BNT");
    if (locale === "en") {
      expect(html).toContain("Create wallet &amp; enable");
      expect(html).toContain("One dedicated wallet for all devices");
      expect(html).toContain("Both use CPU and memory");
    }
  }
});

it("keeps the wallet backup available without exposing paid mining controls", () => {
 const client=new QueryClient();
 client.setQueryData(["shared-xds-settings","owner"],{wallet:{id:"00000000-0000-4000-8000-000000000001",address:"disc1fixture"},devices:[],receivers:[],backup:null});
 const html=renderToStaticMarkup(<QueryClientProvider client={client}><IdleXdsSettings copy={idleMiningCopy} userId="owner" machines={[]} walletOnly /></QueryClientProvider>);
 expect(html).toContain("备份钱包");expect(html).not.toContain("创建钱包并启用");expect(html).not.toContain("<select");
});
