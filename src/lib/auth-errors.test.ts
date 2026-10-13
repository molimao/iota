import { expect, it } from "vitest";
import { authCallbackIssue, authReturnUrl, authErrorText } from "./auth-errors";
import { LOCALES } from "./site";
it("distinguishes expired verification from actual backend failure and cancellation", () => {
  expect(authCallbackIssue("#error=invalid_request&error_description=CSRF+token+is+required")).toBe(
    "login_expired",
  );
  expect(
    authCallbackIssue("#error=server_error&error_description=failed+to+sign+in+with+vendor"),
  ).toBe("login_unavailable");
  expect(authCallbackIssue("#error=access_denied")).toBe("login_canceled");
  expect(authCallbackIssue("#addresses", "?project=noid")).toBeNull();
  expect(authCallbackIssue("#access_token=test-fixture")).toBeNull();
  for (const locale of LOCALES)
    expect(authErrorText("injected <script> private-token", locale)).not.toContain("private-token");
});
it("starts retries with a clean return URL while retaining legitimate project/view parameters", () => {
  expect(authReturnUrl("https://iotahome.site/zh/devices?project=noid#addresses")).toBe(
    "https://iotahome.site/zh/devices?project=noid#addresses",
  );
  expect(
    authReturnUrl(
      "https://iotahome.site/zh/devices?view=membership#error=server_error&error_description=private&state=private",
    ),
  ).toBe("https://iotahome.site/zh/devices?view=membership");
  expect(
    authReturnUrl(
      "https://iotahome.site/zh/devices?view=membership&error=invalid_request&state=private",
    ),
  ).toBe("https://iotahome.site/zh/devices?view=membership");
});
