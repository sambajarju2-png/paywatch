export default function Unauthorized() {
  return (
    <main className="min-h-screen bg-pw-bg flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-pw-red-light rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🚫</span>
        </div>
        <h1 className="text-page-heading text-pw-navy mb-2">Access Denied</h1>
        <p className="text-body text-pw-muted mb-6">
          Your account does not have admin permissions. Contact the PayWatch team if you believe this is an error.
        </p>
        <a
          href="https://app.paywatch.app"
          className="text-pw-blue font-semibold text-sm hover:underline"
        >
          ← Back to PayWatch app
        </a>
      </div>
    </main>
  );
}
