import { isLocale } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";
import { AccountPage, seo } from "@/components/site/pages";

export const Route = createFileRoute("/$locale/account")({
  head: ({ params }) => seo(isLocale(params.locale) ? params.locale : "zh", "account"),
  component: AccountPage,
});
