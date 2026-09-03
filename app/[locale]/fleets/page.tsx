import { notFound } from "next/navigation";
import { FleetsPage } from "@/components/fleets/FleetsPage";

export default async function LocalizedFleetsRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "fr" && locale !== "en") notFound();
  return <FleetsPage locale={locale} />;
}
