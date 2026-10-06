import { describe, it, expect } from "vitest";
import { projectRequestSchema, projectOfficialUrl } from "./project-request";
const valid = {
  requestId: "11111111-1111-4111-8111-111111111111",
  name: " Example GPU ",
  url: "https://github.com/example/project",
  description: "设备状态\n收益",
  locale: "zh",
};
describe("project request input boundaries", () => {
  it("normalizes text and accepts official links without executing content", () => {
    expect(projectRequestSchema.parse(valid)).toMatchObject({
      name: "Example GPU",
      url: valid.url,
    });
    expect(
      projectRequestSchema.safeParse({ ...valid, name: "Coin's request; SELECT 1" }).success,
    ).toBe(true);
    expect(projectOfficialUrl("https://example.com")).toBe("https://example.com/");
  });
  it("rejects HTML, control characters, oversized fields and identity or day spoofing", () => {
    for (const patch of [
      { name: "<script>alert(1)</script>" },
      { name: "A\u202eB" },
      { description: "<img src=x onerror=alert(1)>" },
      { description: "hi\u0000" },
      { name: "x".repeat(81) },
      { description: "x".repeat(1001) },
      { locale: "xx" },
      { userId: "other" },
      { submittedDay: "2099-01-01" },
    ])
      expect(projectRequestSchema.safeParse({ ...valid, ...patch }).success).toBe(false);
  });
  it("rejects dangerous protocols, private destinations and URLs containing credentials or parameters", () => {
    for (const url of [
      "javascript:alert(1)",
      "data:text/html,hi",
      "http://example.com",
      "https://name:pass@example.com/",
      "https://example.com/?token=secret",
      "https://example.com/#secret",
      "https://127.0.0.1/",
      "https://[::1]/",
      "https://localhost/",
      "https://x.internal/",
      "https://example.com:8443/",
      "https://example.com/\n",
    ])
      expect(projectOfficialUrl(url)).toBeNull();
  });
});
