import { it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ProjectAgentConnectView } from "./project-agent-connect";
it("offers one per-card association, keeping raw paths and database configuration out of the form", () => {
  const html = renderToStaticMarkup(
    <ProjectAgentConnectView
      locale="zh"
      choices={[{ id: "example", name: "Mac Studio" }]}
      selected=""
      onSelect={() => {}}
      onSubmit={() => {}}
    />,
  );
  expect(html).toContain("选择这台电脑");
  expect(html).toContain("这个项目在哪台设备上运行");
  expect(html).toContain("Mac Studio");
  expect(html).toContain("disabled");
  expect(html).not.toContain("logPath");
  expect(html).not.toContain("bindingId");
});
it("labels an existing connection as a device change", () => {
  const html = renderToStaticMarkup(
    <ProjectAgentConnectView
      locale="zh"
      choices={[{ id: "example", name: "Mac Studio" }]}
      selected="example"
      connected
      onSelect={() => {}}
      onSubmit={() => {}}
    />,
  );
  expect(html).toContain("更换对应电脑");
  expect(html).not.toContain("disabled");
});
it("asks about the exact Worker rather than the entire wallet", () => {
  const html = renderToStaticMarkup(
    <ProjectAgentConnectView
      locale="zh"
      worker="rig-A"
      choices={[{ id: "mini", name: "Mac mini" }]}
      selected="mini"
      onSelect={() => {}}
      onSubmit={() => {}}
    />,
  );
  expect(html).toContain("Worker rig-A 在哪台电脑上");
  expect(html).not.toContain("这个项目在哪台设备");
});
