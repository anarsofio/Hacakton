import DocumentsClient from "@/components/DocumentsClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ClientDocumentsPage({ params }: Props) {
  const { id } = await params;
  return <DocumentsClient clientId={id} />;
}
