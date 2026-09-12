import { createFileRoute, redirect } from "@tanstack/react-router";
import { detectLocaleOnClient } from "@/lib/site";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ href: `/${detectLocaleOnClient()}`, statusCode: 302 });
  },
});
