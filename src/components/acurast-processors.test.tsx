import { expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AcurastProcessors } from "./acurast-processors";
import type { SiteLocale } from "@/lib/site";
const state=vi.hoisted(()=>({locale:"zh" as SiteLocale}));
vi.mock("./site/locale",()=>({useLocale:()=>state}));
it.each(["zh","zh-TW","en","ja","ko"] as const)("shows manager-owned device cards and unknown heartbeat honestly in %s",locale=>{
  state.locale=locale;
  const html=renderToStaticMarkup(<AcurastProcessors data={{role:"manager",managerIds:["67279"],complete:true,processors:[{id:"processor-one",lastSeen:null,online:null},{id:"processor-two",lastSeen:1792920000000,online:true}]}}/>);
  expect(html.match(/<article/g)).toHaveLength(2);
  expect(html).toContain("processor-one");expect(html).toContain("processor-two");
  expect(html).not.toContain("undefined");expect(html).not.toContain("NaN");
});
