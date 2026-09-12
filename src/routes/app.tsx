import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    throw redirect({ href: "/zh/app", statusCode: 301 });
  },
});
