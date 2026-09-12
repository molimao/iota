import { createFileRoute, redirect } from "@tanstack/react-router";
import { detectLocaleOnClient } from "@/lib/site";

export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    throw redirect({ href: `/${detectLocaleOnClient()}/app`, statusCode: 302 });
  },
});
