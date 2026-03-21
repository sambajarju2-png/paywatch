import Topbar from "@/components/Topbar";
import BottomNav from "@/components/BottomNav";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export default async function BillsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const name = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "";

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Topbar userName={name} />
      <div className="max-w-lg mx-auto pb-safe">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
