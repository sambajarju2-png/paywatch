"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Send, Eye, MousePointerClick, MessageSquare,
  AlertTriangle, RefreshCw, Clock, CheckCircle2, XCircle,
  Mail, User, Building2, ExternalLink,
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  target_type: string | null;
  campaign_mode: string;
  email_subject: string | null;
  email_body: string | null;
  status: string;
  total_contacts: number;
  total_sent: number;
  total_opened: number;
  total_replied: number;
  total_bounced: number;
  created_at: string;
  started_at: string | null;
  from_email: string;
  from_name: string;
}

interface EmailLog {
  id: string;
  contact_id: string;
  to_email: string;
  to_name: string | null;
  subject: string;
  status: string;
  sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  replied_at: string | null;
  bounced_at: string | null;
  contact: {
    organization_name: string;
    contact_person: string | null;
  } | null;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    sent: { bg: "bg-blue-50", text: "text-blue-600", label: "Sent" },
    opened: { bg: "bg-green-50", text: "text-green-600", label: "Opened" },
    clicked: { bg: "bg-purple-50", text: "text-purple-600", label: "Clicked" },
    replied: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Replied" },
    bounced: { bg: "bg-red-50", text: "text-red-600", label: "Bounced" },
  };
  const s = map[status] || map.sent;
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: typeof Send; label: string; value: number; color: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${color}14` }}>
          <Icon className="h-3.5 w-3.5" style={{ color }} strokeWidth={2} />
        </div>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function fmtDate(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("nl", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/outreach/campaigns/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCampaign(data.campaign);
        setEmails(data.emails || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const opened = emails.filter(e => e.opened_at).length;
  const clicked = emails.filter(e => e.clicked_at).length;
  const replied = emails.filter(e => e.replied_at).length;
  const bounced = emails.filter(e => e.bounced_at).length;
  const sent = emails.filter(e => e.sent_at).length;

  // Derive effective status for each email
  function effectiveStatus(e: EmailLog): string {
    if (e.bounced_at) return "bounced";
    if (e.replied_at) return "replied";
    if (e.clicked_at) return "clicked";
    if (e.opened_at) return "opened";
    return "sent";
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <RefreshCw className="h-5 w-5 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 text-center text-slate-400">
        Campaign not found
      </div>
    );
  }

  const openRate = sent > 0 ? Math.round((opened / sent) * 100) : 0;
  const replyRate = sent > 0 ? Math.round((replied / sent) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        {/* Back link */}
        <Link href="/outreach/campaigns" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 mb-4 transition-colors">
          <ArrowLeft size={14} /> Back to campaigns
        </Link>

        {/* Header */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">{campaign.name}</h1>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  campaign.status === "active" ? "bg-green-50 text-green-600" :
                  campaign.status === "draft" ? "bg-slate-100 text-slate-500" :
                  "bg-amber-50 text-amber-600"
                }`}>{campaign.status}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
                  {campaign.campaign_mode}
                </span>
              </div>
              {campaign.description && (
                <p className="text-sm text-slate-500 mt-1">{campaign.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <span>From: {campaign.from_name} ({campaign.from_email})</span>
                <span>Created: {fmtDate(campaign.created_at)}</span>
                {campaign.started_at && <span>Started: {fmtDate(campaign.started_at)}</span>}
              </div>
              {campaign.email_subject && (
                <p className="text-xs text-slate-500 mt-2">
                  Subject: <span className="font-medium text-slate-700 dark:text-slate-300">{campaign.email_subject}</span>
                </p>
              )}
            </div>
            <button onClick={fetchData} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <RefreshCw size={14} className={`text-slate-400 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
          <StatCard icon={Send} label="Sent" value={sent} color="#2563EB" />
          <StatCard icon={Eye} label={`Opened (${openRate}%)`} value={opened} color="#059669" />
          <StatCard icon={MousePointerClick} label="Clicked" value={clicked} color="#7C3AED" />
          <StatCard icon={MessageSquare} label={`Replied (${replyRate}%)`} value={replied} color="#0891B2" />
          <StatCard icon={AlertTriangle} label="Bounced" value={bounced} color="#DC2626" />
        </div>

        {/* Recipient table */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Recipients ({emails.length})
            </h2>
          </div>

          {emails.length === 0 ? (
            <p className="px-5 py-8 text-sm text-slate-400 text-center">No emails sent yet</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {emails.map(email => (
                <div key={email.id} className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  {/* Avatar */}
                  <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[11px] font-bold text-slate-500 shrink-0">
                    {(email.to_name || email.to_email)[0]?.toUpperCase()}
                  </div>

                  {/* Name + org */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/outreach/contacts/${email.contact_id}`}
                        className="text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors truncate"
                      >
                        {email.to_name || email.to_email}
                      </Link>
                      {email.contact?.organization_name && (
                        <span className="text-[10px] text-slate-400 truncate">{email.contact.organization_name}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{email.to_email}</p>
                  </div>

                  {/* Status badge */}
                  <StatusBadge status={effectiveStatus(email)} />

                  {/* Activity timestamps */}
                  <div className="hidden sm:flex items-center gap-3 text-[10px] text-slate-400 shrink-0">
                    {email.sent_at && (
                      <span className="flex items-center gap-0.5" title={`Sent: ${email.sent_at}`}>
                        <Send size={9} /> {fmtDate(email.sent_at)}
                      </span>
                    )}
                    {email.opened_at && (
                      <span className="flex items-center gap-0.5 text-green-600" title={`Opened: ${email.opened_at}`}>
                        <Eye size={9} /> {fmtDate(email.opened_at)}
                      </span>
                    )}
                    {email.replied_at && (
                      <span className="flex items-center gap-0.5 text-cyan-600" title={`Replied: ${email.replied_at}`}>
                        <MessageSquare size={9} /> {fmtDate(email.replied_at)}
                      </span>
                    )}
                    {email.bounced_at && (
                      <span className="flex items-center gap-0.5 text-red-500" title={`Bounced: ${email.bounced_at}`}>
                        <XCircle size={9} /> {fmtDate(email.bounced_at)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
