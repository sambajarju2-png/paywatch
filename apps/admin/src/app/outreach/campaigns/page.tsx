"use client";

import { Send } from "lucide-react";

export default function OutreachCampaigns() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
        <Send size={20} className="text-pw-blue" />
      </div>
      <h2 className="text-sm font-bold text-pw-navy mb-1">Campaign Builder</h2>
      <p className="text-xs text-pw-muted max-w-xs">
        Create AI-powered email campaigns with personalized sequences. Coming in Phase 2.
      </p>
    </div>
  );
}
