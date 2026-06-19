/**
 * PayWatch — canonical org tier + feature configuration (single source of truth).
 *
 * Shared by @paywatch/b2b and @paywatch/admin so the two org-management surfaces
 * can never drift. The consumer app (separate repo: sambafinance1) keeps its own
 * copy of FEATURE_FLAGS + getEffectiveFeatures and MUST be kept in sync with this file.
 *
 * Feature model (decided 2026-06-19):
 *   - tier = the CEILING: which features an org is entitled to.
 *   - per-org `organizations.features` jsonb = on/off toggle WITHIN that ceiling.
 *   - a feature is EFFECTIVE iff the tier includes it AND the org toggled it on.
 *   - default for an unset toggle is OFF (safe). New orgs get an explicit value for
 *     every flag via seedFeatures(); existing orgs are backfilled in a data migration.
 */

// ---------------------------------------------------------------------------
// Org types
// ---------------------------------------------------------------------------

export type OrgType =
  | "gemeente"
  | "incasso"
  | "hulporganisatie"
  | "bewindvoerder"
  | "kredietbank";

/** Canonical org type list (matches the organizations_type_check DB constraint). */
export const ORG_TYPES: OrgType[] = [
  "gemeente",
  "incasso",
  "hulporganisatie",
  "bewindvoerder",
  "kredietbank",
];

export const ORG_TYPE_LABELS: Record<OrgType, string> = {
  gemeente: "Gemeente",
  incasso: "Incassobureau",
  hulporganisatie: "Hulporganisatie",
  bewindvoerder: "Bewindvoerder",
  kredietbank: "Kredietbank",
};

// ---------------------------------------------------------------------------
// Feature flags
// ---------------------------------------------------------------------------

export type FeatureFlag =
  | "buddy_system"
  | "ai_insights"
  | "camera_scan"
  | "payment_plans"
  | "push_notifications"
  | "escalation_alerts"
  | "spending_analytics"
  | "export_reports"
  | "bank_sync"
  | "community"
  | "api_access"
  | "custom_branding"
  | "audit_log"
  | "webhooks"
  | "white_label";

/** Canonical flag list + display order. The one true list of feature flags. */
export const FEATURE_FLAGS: FeatureFlag[] = [
  "buddy_system",
  "ai_insights",
  "camera_scan",
  "payment_plans",
  "push_notifications",
  "escalation_alerts",
  "spending_analytics",
  "export_reports",
  "bank_sync",
  "community",
  "api_access",
  "custom_branding",
  "audit_log",
  "webhooks",
  "white_label",
];

/** Dutch UI labels (informal register; brand/keyword terms kept verbatim). */
export const FEATURE_LABELS: Record<FeatureFlag, string> = {
  buddy_system: "Buddy-systeem",
  ai_insights: "AI-inzichten",
  camera_scan: "Camera scan",
  payment_plans: "Betaalregelingen",
  push_notifications: "Push-meldingen",
  escalation_alerts: "Escalatie-waarschuwingen",
  spending_analytics: "Uitgaven-analyse",
  export_reports: "Rapporten exporteren",
  bank_sync: "Bankkoppeling",
  community: "Community",
  api_access: "API-toegang",
  custom_branding: "Eigen huisstijl",
  audit_log: "Audit-log",
  webhooks: "Webhooks",
  white_label: "White-label",
};

export type TierFeatures = Record<FeatureFlag, boolean>;

// ---------------------------------------------------------------------------
// Tiers
// ---------------------------------------------------------------------------

export type Tier = "pilot" | "professional" | "enterprise";

export interface TierConfig {
  id: Tier;
  label: string;
  color: string;
  bg: string;
  /** Suggested seat limit when this tier is chosen. Overridable per org. */
  defaultSeatLimit: number;
  /** The tier ceiling: which features this tier is entitled to. */
  features: TierFeatures;
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
      ai_insights: false,
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

/**
 * Suggested base pricing (euro cents per period). Starting points only —
 * override per org in organizations.monthly_fee / price_per_seat.
 */
export const TIER_PRICING: Record<Tier, {
  monthly_fee: number; // fixed monthly base fee (cents)
  per_seat: number;    // per active user per period (cents)
}> = {
  pilot: { monthly_fee: 0, per_seat: 0 },
  professional: { monthly_fee: 9900, per_seat: 299 },
  enterprise: { monthly_fee: 29900, per_seat: 199 },
};

// ---------------------------------------------------------------------------
// Resolvers
// ---------------------------------------------------------------------------

export function getTier(tier: string | null | undefined): TierConfig {
  return TIERS[tier as Tier] ?? TIERS.pilot;
}

/** Whether a tier's ceiling includes a feature (i.e. the org may enable it). */
export function tierIncludes(tier: string | null | undefined, flag: FeatureFlag): boolean {
  return getTier(tier).features[flag] === true;
}

/**
 * @deprecated Tier-only check. Use tierIncludes() for "is it in the tier" or
 * getEffectiveFeatures()/isFeatureEnabled() for "is it actually on for this org".
 */
export function hasFeature(tier: string, feature: FeatureFlag): boolean {
  return tierIncludes(tier, feature);
}

export interface OrgFeatureSource {
  tier?: string | null;
  features?: Partial<Record<FeatureFlag, boolean>> | null;
}

/**
 * Effective features for an org = tier ceiling AND per-org toggle.
 * A feature is ON only if the tier includes it AND the org explicitly toggled it true.
 * Returns an explicit boolean for every flag.
 */
export function getEffectiveFeatures(org: OrgFeatureSource): TierFeatures {
  const out = {} as TierFeatures;
  for (const flag of FEATURE_FLAGS) {
    out[flag] = tierIncludes(org.tier, flag) && org.features?.[flag] === true;
  }
  return out;
}

/** Single-flag convenience around getEffectiveFeatures. */
export function isFeatureEnabled(org: OrgFeatureSource, flag: FeatureFlag): boolean {
  return tierIncludes(org.tier, flag) && org.features?.[flag] === true;
}

// ---------------------------------------------------------------------------
// Seeding (used when creating / re-tiering an org)
// ---------------------------------------------------------------------------

/**
 * Per-type sensible defaults (suggested ON state). Always clamped to the tier
 * ceiling by seedFeatures(), so a type default can never enable something the
 * tier doesn't allow. Flags not listed default OFF.
 */
export const TYPE_FEATURE_DEFAULTS: Record<OrgType, Partial<Record<FeatureFlag, boolean>>> = {
  gemeente: {
    bank_sync: true, ai_insights: true, payment_plans: true, community: false, camera_scan: true,
    buddy_system: true, spending_analytics: true, push_notifications: true, export_reports: true, escalation_alerts: true,
  },
  incasso: {
    bank_sync: false, ai_insights: true, payment_plans: true, community: false, camera_scan: true,
    buddy_system: true, spending_analytics: false, push_notifications: true, export_reports: true, escalation_alerts: true,
  },
  bewindvoerder: {
    bank_sync: true, ai_insights: true, payment_plans: true, community: false, camera_scan: true,
    buddy_system: true, spending_analytics: true, push_notifications: true, export_reports: true, escalation_alerts: true,
  },
  hulporganisatie: {
    bank_sync: false, ai_insights: true, payment_plans: true, community: true, camera_scan: true,
    buddy_system: true, spending_analytics: false, push_notifications: true, export_reports: true, escalation_alerts: false,
  },
  kredietbank: {
    bank_sync: true, ai_insights: true, payment_plans: true, community: false, camera_scan: true,
    buddy_system: true, spending_analytics: true, push_notifications: true, export_reports: true, escalation_alerts: true,
  },
};

/**
 * Build a full 15-key features object for a new/re-tiered org: start from the
 * type defaults (or the tier's own defaults when the type is unknown), then clamp
 * every flag to the tier ceiling. Returns an explicit boolean for every flag.
 */
export function seedFeatures(tier: string | null | undefined, type?: string | null): TierFeatures {
  const t = getTier(tier);
  const typeDefaults =
    (type && (TYPE_FEATURE_DEFAULTS as Record<string, Partial<Record<FeatureFlag, boolean>>>)[type]) || null;
  const out = {} as TierFeatures;
  for (const flag of FEATURE_FLAGS) {
    const wanted = typeDefaults ? typeDefaults[flag] === true : t.features[flag] === true;
    out[flag] = t.features[flag] === true && wanted; // clamp to ceiling
  }
  return out;
}

/** Zero out any enabled feature that the tier doesn't include. Returns all 15 keys. */
export function clampFeaturesToTier(
  features: Partial<Record<FeatureFlag, boolean>> | null | undefined,
  tier: string | null | undefined,
): TierFeatures {
  const t = getTier(tier);
  const out = {} as TierFeatures;
  for (const flag of FEATURE_FLAGS) {
    out[flag] = t.features[flag] === true && features?.[flag] === true;
  }
  return out;
}

export function defaultSeatLimitFor(tier: string | null | undefined): number {
  return getTier(tier).defaultSeatLimit;
}
