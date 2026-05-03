/**
 * PayWatch B2B Tier system
 * Defines what each tier (pilot / professional / enterprise) unlocks.
 * Used in both the B2B app (feature gating) and admin (display/edit).
 */

export type Tier = "pilot" | "professional" | "enterprise";

export interface TierConfig {
  id: Tier;
  label: string;
  color: string;
  bg: string;
  defaultSeatLimit: number;
  features: {
    buddy_system: boolean;
    ai_insights: boolean;
    camera_scan: boolean;
    payment_plans: boolean;
    push_notifications: boolean;
    escalation_alerts: boolean;
    spending_analytics: boolean;
    export_reports: boolean;
    bank_sync: boolean;
    community: boolean;
    api_access: boolean;
    custom_branding: boolean;
    audit_log: boolean;
    webhooks: boolean;
    white_label: boolean;
  };
  support: "email" | "priority" | "dedicated";
  sla: string | null;
}

export const TIERS: Record<Tier, TierConfig> = {
  pilot: {
    id: "pilot",
    label: "Pilot",
    color: "#059669",
    bg: "#F0FDF4",
    defaultSeatLimit: 25,
    features: {
      buddy_system: true,
      ai_insights: false,        // basic only
      camera_scan: true,
      payment_plans: true,
      push_notifications: true,
      escalation_alerts: true,
      spending_analytics: false,
      export_reports: false,
      bank_sync: false,
      community: false,
      api_access: false,
      custom_branding: false,
      audit_log: false,
      webhooks: false,
      white_label: false,
    },
    support: "email",
    sla: null,
  },
  professional: {
    id: "professional",
    label: "Professional",
    color: "#2563EB",
    bg: "#EFF6FF",
    defaultSeatLimit: 250,
    features: {
      buddy_system: true,
      ai_insights: true,
      camera_scan: true,
      payment_plans: true,
      push_notifications: true,
      escalation_alerts: true,
      spending_analytics: true,
      export_reports: true,
      bank_sync: false,
      community: false,
      api_access: true,
      custom_branding: false,
      audit_log: true,
      webhooks: true,
      white_label: false,
    },
    support: "priority",
    sla: "99.5% uptime",
  },
  enterprise: {
    id: "enterprise",
    label: "Enterprise",
    color: "#7C3AED",
    bg: "#F5F3FF",
    defaultSeatLimit: 999999,
    features: {
      buddy_system: true,
      ai_insights: true,
      camera_scan: true,
      payment_plans: true,
      push_notifications: true,
      escalation_alerts: true,
      spending_analytics: true,
      export_reports: true,
      bank_sync: true,
      community: true,
      api_access: true,
      custom_branding: true,
      audit_log: true,
      webhooks: true,
      white_label: true,
    },
    support: "dedicated",
    sla: "99.9% uptime, 4h response",
  },
};

export function getTier(tier: string): TierConfig {
  return TIERS[tier as Tier] ?? TIERS.pilot;
}

/** Check if a specific feature is unlocked for a given tier */
export function hasFeature(tier: string, feature: keyof TierConfig["features"]): boolean {
  return getTier(tier).features[feature] ?? false;
}

/**
 * Suggested base pricing (euro cents per period)
 * These are starting points — override per-org in organizations.price_per_seat
 */
export const TIER_PRICING: Record<Tier, {
  monthly_fee: number;   // fixed monthly base fee (cents)
  per_seat: number;      // per active user per period (cents)
}> = {
  pilot:        { monthly_fee: 0,      per_seat: 0    },  // Free pilot
  professional: { monthly_fee: 9900,   per_seat: 299  },  // €99/mo + €2.99/user
  enterprise:   { monthly_fee: 29900,  per_seat: 199  },  // €299/mo + €1.99/user
};
