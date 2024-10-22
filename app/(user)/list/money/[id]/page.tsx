import MoneyComponent from "./money";

export default async function MoneyPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  return <MoneyComponent id={params.id} />;
}
