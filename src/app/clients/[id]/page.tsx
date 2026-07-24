import ClientCaseDashboard from "@/components/ClientCaseDashboard";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ClientCasePage({ params }: Props) {
  const { id } = await params;
  return <ClientCaseDashboard clientId={id} />;
}
