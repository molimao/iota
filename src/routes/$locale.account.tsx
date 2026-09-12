import { createFileRoute } from "@tanstack/react-router";
import { AccountPage, seo } from "@/components/site/pages";

export const Route = createFileRoute("/$locale/account")({
  head: ({ params }) => seo(params.locale === "en" ? "en" : "zh", "account"),
  component: AccountPage,
});
