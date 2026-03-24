import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'https://paywatch.app';

// Pages that should NOT appear in sitemap
const EXCLUDED = ['api', '_not-found', 'opengraph-image', 'icon', 'robots', 'sitemap'];

function getPages(dir: string, prefix = ''): string[] {
  const pages: string[] = [];
  
  if (!existsSync(dir)) return pages;
  
  const entries = readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    if (EXCLUDED.includes(entry.name)) continue;
    
    if (entry.isDirectory()) {
      // Check if this directory has a page.tsx
      const pagePath = join(dir, entry.name, 'page.tsx');
      const route = `${prefix}/${entry.name}`;
      
      if (existsSync(pagePath)) {
        pages.push(route);
      }
      
      // Recurse into subdirectories (skip route groups like (app))
      if (!entry.name.startsWith('[')) {
        pages.push(...getPages(join(dir, entry.name), route));
      }
    }
  }
  
  return pages;
}

export default function sitemap() {
  const appDir = join(process.cwd(), 'src', 'app');
  const dynamicPages = getPages(appDir);
  
  // Always include the homepage
  const routes = ['', ...dynamicPages];
  
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly' as const,
    priority: route === '' ? 1 : route.match(/features|pricing/) ? 0.8 : 0.6,
  }));
}
