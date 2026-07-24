import DocumentsClient from "@/components/DocumentsClient";

export default function DocumentsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-serif-display text-xl font-semibold text-navy">
        Select a client to manage documents
      </p>
      <p className="mt-2 text-sm text-muted">
        Open a client workspace from the dashboard, then go to Documents.
      </p>
    </div>
  );
}
