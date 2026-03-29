"use client";

import { Mail } from "lucide-react";

export default function OutreachQueue() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
        <Mail size={20} className="text-pw-amber" />
      </div>
      <h2 className="text-sm font-bold text-pw-navy mb-1">Send Queue</h2>
      <p className="text-xs text-pw-muted max-w-xs">
        View and manage queued emails, delivery status, and send history. Coming in Phase 2.
      </p>
    </div>
  );
}
