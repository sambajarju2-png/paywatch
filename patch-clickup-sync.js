#!/usr/bin/env node
/**
 * patch-clickup-sync.js
 * Run once from the monorepo root to add:
 * 1. billing_vendor type to outreach UI
 * 2. ClickUp sync on status change (admin → ClickUp)
 * 3. "Sync" refresh button on pipeline page
 *
 * Usage: node patch-clickup-sync.js
 */

const fs = require("fs");
const path = require("path");

let applied = 0;
let skipped = 0;

function patch(file, description, find, replace) {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file} — skipping "${description}"`);
    return;
  }

  let content = fs.readFileSync(filePath, "utf-8");

  // Check if already patched
  if (content.includes(replace.slice(0, 40))) {
    console.log(`⏭️  Already patched: ${file} — "${description}"`);
    skipped++;
    return;
  }

  if (!content.includes(find)) {
    console.log(`⚠️  Pattern not found in ${file} — "${description}"`);
    skipped++;
    return;
  }

  content = content.replace(find, replace);
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`✅ Applied: ${file} — "${description}"`);
  applied++;
}

// ── 1. Add billing_vendor to contacts page TYPE_OPTIONS ──
patch(
  "apps/admin/src/app/outreach/page.tsx",
  "Add billing_vendor to TYPE_OPTIONS",
  '{ value: "journalist", label: "Journalist" },\n];',
  '{ value: "journalist", label: "Journalist" },\n  { value: "billing_vendor", label: "Billing Vendor" },\n];'
);

// ── 2. Add billing_vendor to pipeline TYPE_BADGE ──
patch(
  "apps/admin/src/app/outreach/pipeline/page.tsx",
  "Add billing_vendor to TYPE_BADGE",
  'kredietbank: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",\n};',
  'kredietbank: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",\n  billing_vendor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",\n};'
);

// ── 3. Add ClickUp sync after moveContact PATCH call (pipeline page) ──
patch(
  "apps/admin/src/app/outreach/pipeline/page.tsx",
  "Add ClickUp sync to moveContact",
  `if (res.ok) {
        setContacts((prev) => prev.map((c) => (c.id === contactId ? { ...c, status: newStatus } : c)));
      }`,
  `if (res.ok) {
        setContacts((prev) => prev.map((c) => (c.id === contactId ? { ...c, status: newStatus } : c)));
        // Sync status to ClickUp (fire-and-forget)
        fetch("/api/admin/outreach/sync-clickup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contact_id: contactId, status: newStatus }),
        }).catch(() => {});
      }`
);

// ── 4. Add "Sync" button import + state to pipeline page ──
// Add RefreshCw icon to lucide imports
patch(
  "apps/admin/src/app/outreach/pipeline/page.tsx",
  "Add RefreshCw icon import",
  'GripVertical,\n} from "lucide-react";',
  'GripVertical,\n  RefreshCw,\n} from "lucide-react";'
);

// Try alternative import pattern (if GripVertical was already removed)
patch(
  "apps/admin/src/app/outreach/pipeline/page.tsx",
  "Add RefreshCw icon import (alt pattern)",
  'GripVertical\n} from "lucide-react";',
  'GripVertical,\n  RefreshCw\n} from "lucide-react";'
);

// ── 5. Add syncing state and sync handler after filterType state ──
patch(
  "apps/admin/src/app/outreach/pipeline/page.tsx",
  "Add syncing state + handler",
  'const [filterType, setFilterType] = useState<string>("all");',
  `const [filterType, setFilterType] = useState<string>("all");
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const syncFromClickUp = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/admin/outreach/sync-clickup");
      if (res.ok) {
        const data = await res.json();
        if (data.synced > 0) {
          setSyncResult(\`Synced \${data.synced} change\${data.synced > 1 ? "s" : ""}\`);
          fetchContacts(); // refresh the board
        } else {
          setSyncResult("Everything up to date");
        }
      } else {
        setSyncResult("Sync failed");
      }
    } catch {
      setSyncResult("Sync failed");
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncResult(null), 3000);
    }
  };`
);

// ── 6. Add Sync button next to the type filter dropdown ──
// Look for the filter dropdown and add a sync button after it
patch(
  "apps/admin/src/app/outreach/pipeline/page.tsx",
  "Add Sync button to header",
  `<select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}`,
  `<button
            onClick={syncFromClickUp}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
            title="Sync statuses from ClickUp"
          >
            <RefreshCw className={\`h-3.5 w-3.5 \${syncing ? "animate-spin" : ""}\`} />
            {syncing ? "Syncing..." : "Sync"}
          </button>
          {syncResult && (
            <span className="text-xs text-gray-500 dark:text-gray-400">{syncResult}</span>
          )}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}`
);

console.log(`\nDone. Applied: ${applied}, Skipped: ${skipped}`);
console.log(`\nRemember to add these env vars to Vercel (admin project):`);
console.log(`  CLICKUP_API_KEY = pk_218482456_HRE92TJDU1MHA7B8WIZPQGSU95VZSV0C`);
console.log(`  CLICKUP_WEBHOOK_SECRET = B5BIFGYEW4ZYU7T3NKQLX01PEWCB44KKLSENDAZ0DX0OPMMAPDYJS9UPIYISWV5J`);
