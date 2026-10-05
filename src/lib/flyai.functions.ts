import { createServerFn } from "@tanstack/react-start";
export const getFlyaiMonth = createServerFn({ method: "POST" }).handler(async () => {
  const { readFlyaiMonth } = await import("./flyai.server");
  return readFlyaiMonth();
});
