import MoneyComponent from "./money";

export default async function MoneyPage({
  params,
}: {
  params: { id: string };
}) {
  return <MoneyComponent id={params.id} />;
}
