import { Button } from "@paywatch/ui";

export default function Home() {
  return (
    <main className="min-h-screen bg-pw-bg flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-page-heading text-pw-navy mb-2">PayWatch</h1>
        <p className="text-body text-pw-muted mb-6">
          Web app placeholder — your sambafinance1 code will be migrated here.
        </p>
        <Button variant="primary">app.paywatch.app</Button>
      </div>
    </main>
  );
}
