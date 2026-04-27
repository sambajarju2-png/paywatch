import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewOrgPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user || tenant.mode !== "super-admin") redirect("/");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <span className="text-xl font-black tracking-tight">PayWatch</span>
          <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded">PLATFORM</span>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nieuwe organisatie</h1>
        <NewOrgForm />
      </main>
    </div>
  );
}

function NewOrgForm() {
  return (
    <form action="/api/organizations" method="POST" className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
          <input name="name" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Gemeente Rotterdam" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug (wordt subdomain)</label>
          <div className="flex items-center gap-0">
            <input name="slug" required className="flex-1 px-3 py-2 border border-gray-200 rounded-l-lg text-sm" placeholder="rotterdam" />
            <span className="px-3 py-2 bg-gray-50 border border-l-0 border-gray-200 rounded-r-lg text-sm text-gray-500">.paywatch.app</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select name="type" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option value="gemeente">Gemeente</option>
            <option value="incasso">Incassobureau</option>
            <option value="bewindvoerder">Bewindvoerder</option>
            <option value="hulporganisatie">Hulporganisatie</option>
            <option value="kredietbank">Kredietbank</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primaire kleur</label>
            <input name="primary_color" type="color" defaultValue="#2563EB" className="w-full h-10 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
            <select name="tier" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="pilot">Pilot</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact e-mail</label>
          <input name="contact_email" type="email" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="info@gemeente.nl" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
          <input name="logo_url" type="url" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="https://img.logo.dev/..." />
        </div>
      </div>

      <button type="submit" className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
        Organisatie aanmaken
      </button>
    </form>
  );
}
