import {expect,it,vi} from "vitest";
import {renderToStaticMarkup} from "react-dom/server";
import {ProjectReadingMetrics,projectReadingMetrics} from "./project-reading-metrics";
import {REVIEW_PROJECTS,layoutReading} from "./project-layout-review-data";
import {fleetCopy} from "./fleet-copy";
import {LOCALES} from "@/lib/site";
vi.mock("./site/locale",()=>({useLocale:()=>({locale:"zh"})}));
it.each(REVIEW_PROJECTS)("renders %s metrics without repeating a semantic field",project=>{
 for(const locale of LOCALES){const data=layoutReading(project,locale),items=projectReadingMetrics(project,data,locale);expect(new Set(items.map(m=>m.key)).size).toBe(items.length);expect(items.every(m=>m.label&&m.value!==null)).toBe(true);}
 const html=renderToStaticMarkup(<ProjectReadingMetrics project={project} data={layoutReading(project,"zh")}/>);expect(html).not.toContain("undefined");expect(html).not.toContain("NaN");
});
it("counts a shared wallet balance once while retaining distinct zero reward fields",()=>{
 const c=fleetCopy("zh");const base={activity:"—",today:null,lifetime:"0",unit:"XID",totalLabel:c.balance,accountSummary:{kind:"balance" as const,amount:"0",unit:"XID"}};
 expect(projectReadingMetrics("xid",base,"zh").map(m=>m.key)).toEqual(["account"]);
 expect(projectReadingMetrics("xid",{...base,today:"0"},"zh").map(m=>m.key)).toEqual(["account","period"]);
});
it("keeps task counts and weights separate from token units and preserves USD earnings",()=>{
 expect(projectReadingMetrics("nosana",layoutReading("nosana","zh"),"zh").find(m=>m.key==="total")?.unit).toBe("");
 expect(projectReadingMetrics("ionet",layoutReading("ionet","zh"),"zh").find(m=>m.key==="period")?.unit).toBe("USD");
});
