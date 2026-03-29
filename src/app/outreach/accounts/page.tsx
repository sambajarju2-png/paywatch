"use client";

import { Shield } from "lucide-react";

export default function OutreachAccounts() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
        <Shield size={20} className="text-pw-green" />
      </div>
      <h2 className="text-sm font-bold text-pw-navy mb-1">Sending Accounts</h2>
      <p className="text-xs text-pw-muted max-w-xs">
        Manage sending accounts, warmup progress, and daily limits. Coming in Phase 2.
      </p>
    </div>
  );
}
