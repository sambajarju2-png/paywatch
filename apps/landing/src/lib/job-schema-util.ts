// Google Jobs JSON-LD structured data generator
// Add this to your jobs layout or page to make jobs appear in Google Jobs search

// EU + EEA + UK + Switzerland. Used for remote roles open to applicants across Europe.
const EUROPE_COUNTRIES = [
  'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
  'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary',
  'Iceland', 'Ireland', 'Italy', 'Latvia', 'Liechtenstein', 'Lithuania',
  'Luxembourg', 'Malta', 'Netherlands', 'Norway', 'Poland', 'Portugal',
  'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland',
  'United Kingdom',
];

export function generateJobPostingSchema(jobs: {
  id: string;
  title: { nl: string; en: string };
  description: { nl: string; en: string };
  longDescription: { nl: string; en: string };
  department: { nl: string; en: string };
  location: 'remote' | 'hybrid' | 'office';
  salary: string;
  seniority: string;
}[]) {
  return jobs.map((job) => ({
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title.nl,
    description: `<p>${job.longDescription.nl}</p>`,
    identifier: {
      '@type': 'PropertyValue',
      name: 'PayWatch',
      value: job.id,
    },
    datePosted: new Date().toISOString().split('T')[0],
    validThrough: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    employmentType: 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'PayWatch',
      sameAs: 'https://paywatch.app',
      logo: 'https://paywatch.app/favicon-32x32.png',
    },
    ...(job.location === 'remote'
      ? {
          jobLocationType: 'TELECOMMUTE',
          applicantLocationRequirements: EUROPE_COUNTRIES.map((name) => ({
            '@type': 'Country',
            name,
          })),
        }
      : {
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Rotterdam',
              addressRegion: 'Zuid-Holland',
              addressCountry: 'NL',
            },
          },
        }),
    directApply: true,
    industry: 'Financial Technology',
  }));
}
