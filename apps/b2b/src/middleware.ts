import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "paywatch.app";

// Super-admin emails (same as admin app)
const SUPER_ADMINS = [
  "sambajarju2@gmail.com",
  "samba@paywatch.nl",
  "mariama@paywatch.com",
];

function extractSubdomain(hostname: string): string | null {
  // Local dev: b2b.localhost:3003 or ggn.localhost:3003
  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    const parts = hostname.split(".")[0];
    if (parts && parts !== "localhost") return parts;
    return null;
  }

  // Vercel preview: tenant---branch.vercel.app
  if (hostname.endsWith(".vercel.app")) {
    const parts = hostname.split("---");
    if (parts.length > 1) return parts[0];
    return null;
  }

  // Production: ggn.paywatch.app, flanderijn.paywatch.app, b2b.paywatch.app
  const rootFormatted = ROOT_DOMAIN.split(":")[0];
  if (hostname.endsWith(`.${rootFormatted}`)) {
    const subdomain = hostname.replace(`.${rootFormatted}`, "");
    if (subdomain && !subdomain.includes(".")) return subdomain;
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const subdomain = extractSubdomain(hostname);

  // Create response and refresh Supabase session
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session
  const { data: { user } } = await supabase.auth.getUser();

  // Set tenant headers for downstream pages/routes
  if (subdomain) {
    response.headers.set("x-tenant-slug", subdomain);
  }

  // Determine mode: super-admin or org-admin
  const isSuperAdminSubdomain = subdomain === "b2b" || !subdomain;

  if (isSuperAdminSubdomain) {
    // Super admin mode — only allow SUPER_ADMINS
    response.headers.set("x-tenant-mode", "super-admin");

    // If logged in but not super admin, block access (except login page)
    const pathname = request.nextUrl.pathname;
    if (user && !SUPER_ADMINS.includes(user.email?.toLowerCase() || "")) {
      if (pathname !== "/login" && !pathname.startsWith("/api/auth")) {
        return NextResponse.redirect(new URL("/login?error=forbidden", request.url));
      }
    }

    // If not logged in, redirect to login (except login page and auth routes)
    if (!user && pathname !== "/login" && !pathname.startsWith("/api/")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    // Org admin mode — resolve tenant from subdomain
    response.headers.set("x-tenant-mode", "org-admin");

    // Look up org by slug using direct REST API (more reliable in edge middleware)
    let org: any = null;
    try {
      const orgRes = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/organizations?slug=eq.${subdomain}&status=eq.active&select=id,name,slug,type,status,logo_url,primary_color,features,tier&limit=1`,
        {
          headers: {
            "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY!,
            "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
          },
        }
      );
      const orgs = await orgRes.json();
      if (Array.isArray(orgs) && orgs.length > 0) {
        org = orgs[0];
      }
    } catch (e) {
      console.error("Org lookup failed:", e);
    }

    if (!org) {
      // Unknown subdomain — show 404
      return NextResponse.redirect(
        new URL(`https://b2b.${ROOT_DOMAIN}/not-found?slug=${subdomain}`, request.url)
      );
    }

    response.headers.set("x-tenant-id", org.id);
    response.headers.set("x-tenant-name", encodeURIComponent(org.name));
    response.headers.set("x-tenant-type", org.type);
    response.headers.set("x-tenant-color", org.primary_color || "#2563EB");
    response.headers.set("x-tenant-logo", org.logo_url || "");

    // If not logged in, redirect to login (except login page and auth routes)
    const pathname = request.nextUrl.pathname;
    if (!user && pathname !== "/login" && !pathname.startsWith("/api/")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // If logged in, verify they are a member of this org
    if (user) {
      let membership: any = null;
      try {
        const memRes = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/organization_members?organization_id=eq.${org.id}&user_id=eq.${user.id}&select=id,role&limit=1`,
          {
            headers: {
              "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY!,
              "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
            },
          }
        );
        const members = await memRes.json();
        if (Array.isArray(members) && members.length > 0) {
          membership = members[0];
        }
      } catch (e) {
        console.error("Membership check failed:", e);
      }

      // Also check if super admin (they can access any org)
      const isSuperAdmin = SUPER_ADMINS.includes(user.email?.toLowerCase() || "");

      if (!membership && !isSuperAdmin) {
        if (pathname !== "/login" && !pathname.startsWith("/api/auth")) {
          return NextResponse.redirect(new URL("/login?error=not-member", request.url));
        }
      }

      if (membership) {
        response.headers.set("x-member-role", membership.role);
        response.headers.set("x-member-id", membership.id);
      }
      if (isSuperAdmin) {
        response.headers.set("x-member-role", "super_admin");
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.ico).*)",
  ],
};
