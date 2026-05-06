'use client';

interface Invite {
  id: string;
  email: string | null;
  external_id: string | null;
  token: string | null;
  status: string;
  invite_type: string | null;
  created_at: string;
  expires_at: string | null;
  activated_at: string | null;
  qr_code_url: string | null;
  short_code?: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'In afwachting', bg: 'bg-pw-bg', text: 'text-pw-muted' },
  opened: { label: 'Geopend', bg: 'bg-blue-50', text: 'text-pw-blue' },
  activated: { label: 'Geactiveerd', bg: 'bg-green-50', text: 'text-pw-green' },
  expired: { label: 'Verlopen', bg: 'bg-red-50', text: 'text-pw-red' },
  revoked: { label: 'Ingetrokken', bg: 'bg-red-50', text: 'text-pw-red' },
};

export default function InviteTable({ invites }: { invites: Invite[] }) {
  if (invites.length === 0) {
    return <div className="p-12 text-center text-sm text-pw-muted">Nog geen uitnodigingen verstuurd</div>;
  }

  return (
    <table className="w-full">
      <thead className="bg-pw-bg border-b border-pw-border">
        <tr>
          <th className="text-left py-3 px-5 text-[11px] font-bold text-pw-muted uppercase tracking-wider">Ontvanger</th>
          <th className="text-left py-3 px-5 text-[11px] font-bold text-pw-muted uppercase tracking-wider">Status</th>
          <th className="text-left py-3 px-5 text-[11px] font-bold text-pw-muted uppercase tracking-wider">Link</th>
          <th className="text-left py-3 px-5 text-[11px] font-bold text-pw-muted uppercase tracking-wider">Datum</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-pw-border">
        {invites.map((inv) => {
          const sc = STATUS_CONFIG[inv.status] || STATUS_CONFIG.pending;
          const displayCode = inv.short_code || ('PW-' + (inv.token?.substring(0, 6) || '').toUpperCase());
          return (
            <tr key={inv.id} className="hover:bg-pw-bg/30 transition-colors group">
              <td className="py-3 px-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pw-blue to-pw-purple text-white flex items-center justify-center text-xs font-bold">
                    {inv.email ? inv.email[0].toUpperCase() : '?'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-pw-navy">{inv.email || 'Geen e-mail'}</div>
                    {inv.external_id && <div className="text-[10px] text-pw-muted font-mono">Ref: {inv.external_id}</div>}
                  </div>
                </div>
              </td>
              <td className="py-3 px-5">
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded ${sc.bg} ${sc.text}`}>{sc.label}</span>
              </td>
              <td className="py-3 px-5">
                <div className="flex items-center gap-2">
                  <code className="text-[12px] font-bold text-pw-blue font-mono bg-pw-blue/8 px-2 py-1 rounded-md">{displayCode}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(displayCode)}
                    className="opacity-0 group-hover:opacity-100 text-pw-muted hover:text-pw-blue transition-all"
                    title="Kopieer code"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  </button>
                </div>
              </td>
              <td className="py-3 px-5 text-sm text-pw-muted">
                {new Date(inv.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
