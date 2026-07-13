import type { VendorKey } from './comparisons';

export interface AlternativeCandidate {
  vendor: VendorKey;
  reason: string;
  tradeoff: string;
}

export interface AlternativePage {
  slug: string;
  target: Exclude<VendorKey, 'quid'>;
  titleName: string;
  description: string;
  opening: string;
  direct: string;
  targetStillFits: string;
  decisionPrompt: string;
  candidates: AlternativeCandidate[];
}

export const alternatives: AlternativePage[] = [
  {
    slug: 'aline-alternatives',
    target: 'aline',
    titleName: 'Aline Alternatives',
    description: 'Compare five Aline alternatives for senior living CRM, AI sales engagement, tour scheduling and focused admissions automation in 2026.',
    opening: 'Aline alternatives range from other purpose-built senior living CRMs to AI engagement platforms and focused admissions workflows. The right shortlist depends on whether the operator needs to replace its system of record or fix a narrower inquiry-to-tour problem.',
    direct: 'Consider ECP CRM or WelcomeHome when replacing the CRM, Advantage Anywhere when customization and lead-to-lease automation matter, Further when the current CRM can remain and multi-channel AI engagement is the priority, or Quid when one community wants to test a focused website-inquiry-to-tour workflow.',
    targetStillFits: 'Aline may remain the stronger shortlist choice when the operator wants Aline CRM plus connected sales, marketing, referral, resident, financial or operational products in the same ecosystem.',
    decisionPrompt: 'Does the project require a new CRM and connected platform, or can the current system stay while one admissions bottleneck is fixed?',
    candidates: [
      { vendor: 'ecp', reason: 'Purpose-built assisted living CRM connected to a broader ECP clinical and operational platform.', tradeoff: 'The project may involve CRM migration and selection of wider ECP modules.' },
      { vendor: 'welcomehome', reason: 'Purpose-built CRM centered on prospects, referrers, communications, campaigns and reporting.', tradeoff: 'Confirm migration, integrations, tier differences and escalation workflows.' },
      { vendor: 'advantage-anywhere', reason: 'Customizable lead-to-lease CRM with marketing automation and portfolio reporting.', tradeoff: 'Tour scheduling and exact implementation scope should be demonstrated directly.' },
      { vendor: 'further', reason: 'AI engagement across web, phone, SMS and email while connecting to a CRM.', tradeoff: 'It is not positioned as the replacement system of record.' },
      { vendor: 'quid', reason: 'Focused inquiry acknowledgement, tour coordination and approved follow-up around current tools.', tradeoff: 'Quid is intentionally narrower and does not replace a senior living CRM.' },
    ],
  },
  {
    slug: 'further-alternatives',
    target: 'further',
    titleName: 'Further Alternatives',
    description: 'Compare five Further alternatives for senior living AI sales, CRM, tour scheduling, follow-up automation and implementation scope in 2026.',
    opening: 'Further alternatives include complete senior living CRMs, connected operating platforms and a focused admissions workflow. The key decision is whether the operator wants multi-channel AI engagement around a CRM, a new system of record, or a smaller first implementation.',
    direct: 'Consider Aline for a connected CRM platform with sales and marketing products, ECP or WelcomeHome for a purpose-built CRM, Advantage Anywhere for customizable lead-to-lease automation, or Quid for a narrowly scoped email-based inquiry-to-tour pilot.',
    targetStillFits: 'Further may remain the stronger shortlist choice when an operator wants AI engagement across web, inbound phone, SMS and email with tour scheduling and CRM connections.',
    decisionPrompt: 'Is the primary need broader engagement across several channels, a CRM replacement, or one controlled website-inquiry workflow?',
    candidates: [
      { vendor: 'aline', reason: 'A connected senior living CRM platform with sales, marketing and wider operating products.', tradeoff: 'Buyers must determine which modules and subscription tier are required.' },
      { vendor: 'ecp', reason: 'Purpose-built CRM with lead capture, tour scheduling, follow-up and CRM-to-clinical continuity.', tradeoff: 'Best evaluated as a CRM and broader platform decision, not only an engagement layer.' },
      { vendor: 'welcomehome', reason: 'Senior living CRM with prospect, referrer, communication and campaign workflows.', tradeoff: 'A CRM migration may be required if it becomes the system of record.' },
      { vendor: 'advantage-anywhere', reason: 'Customizable CRM, marketing automation, census visibility and portfolio reporting.', tradeoff: 'Public materials reviewed did not specify the exact tour-scheduling workflow.' },
      { vendor: 'quid', reason: 'One community, one website inquiry source and one tour calendar in a managed pilot.', tradeoff: 'The standard offer does not include phone or SMS and is not a CRM replacement.' },
    ],
  },
  {
    slug: 'ecp-crm-alternatives',
    target: 'ecp',
    titleName: 'ECP CRM Alternatives',
    description: 'Compare five ECP CRM alternatives for senior living CRM, admissions follow-up, tour scheduling, referrals and operational fit in 2026.',
    opening: 'ECP CRM alternatives serve different jobs: replacing the CRM, adding multi-channel prospect engagement, customizing a lead-to-lease process, or fixing one website inquiry workflow without changing the system of record.',
    direct: 'Consider Aline or WelcomeHome for other purpose-built senior living CRM models, Advantage Anywhere for customizable lead-to-lease automation, Further for CRM-connected AI engagement, or Quid for a focused inquiry-to-tour workflow around current tools.',
    targetStillFits: 'ECP CRM may remain the stronger shortlist choice when the operator values an assisted-living sales cycle that connects into ECP clinical, medication, billing or other operational functions.',
    decisionPrompt: 'Does the operator need CRM-to-clinical continuity, a different CRM model, broader digital engagement, or only a focused front-end workflow?',
    candidates: [
      { vendor: 'aline', reason: 'Purpose-built CRM inside a broad connected senior living platform.', tradeoff: 'Module selection, migration and wider platform scope require careful planning.' },
      { vendor: 'welcomehome', reason: 'CRM centered on prospects, professional referrers, communications and reporting.', tradeoff: 'Clinical and operational connections differ from ECP and should be validated.' },
      { vendor: 'advantage-anywhere', reason: 'Customizable lead-to-lease CRM and marketing automation for one community or a portfolio.', tradeoff: 'Confirm tour scheduling, clinical connections and data migration directly.' },
      { vendor: 'further', reason: 'Multi-channel AI sales engagement connected to an existing CRM and calendar.', tradeoff: 'It does not serve the same CRM-to-clinical system role as ECP.' },
      { vendor: 'quid', reason: 'Managed inquiry acknowledgement, tour coordination and follow-up around an existing workflow.', tradeoff: 'Quid does not replace ECP CRM or provide clinical and billing functions.' },
    ],
  },
  {
    slug: 'welcomehome-alternatives',
    target: 'welcomehome',
    titleName: 'WelcomeHome Alternatives',
    description: 'Compare five WelcomeHome alternatives for senior living CRM, lead management, referrals, tour scheduling and focused admissions automation in 2026.',
    opening: 'WelcomeHome alternatives include other senior living systems of record, customizable sales automation, AI engagement around an existing CRM and a focused admissions implementation. Start by deciding whether prospect and referral records need a new home.',
    direct: 'Consider Aline or ECP for other purpose-built platform-connected CRMs, Advantage Anywhere for customizable lead-to-lease workflows, Further for multi-channel AI engagement, or Quid when the CRM can remain and one inquiry-to-tour gap needs a controlled test.',
    targetStillFits: 'WelcomeHome may remain the stronger shortlist choice when prospect, referrer, communication, campaign and reporting workflows need to live in a purpose-built senior living CRM.',
    decisionPrompt: 'Is the project primarily about prospect and referrer records, wider platform connections, multi-channel engagement, or one follow-up bottleneck?',
    candidates: [
      { vendor: 'aline', reason: 'Senior living CRM with connected growth, referral and broader operating products.', tradeoff: 'The required product mix and migration scope can be wider than a CRM-only decision.' },
      { vendor: 'ecp', reason: 'Assisted living CRM that connects the admissions cycle into the broader ECP platform.', tradeoff: 'The strongest fit may depend on adopting or already using the ECP environment.' },
      { vendor: 'advantage-anywhere', reason: 'Customizable CRM, marketing automation, census tracking and reporting.', tradeoff: 'Ask for a live demonstration of tours, handoffs and communications.' },
      { vendor: 'further', reason: 'AI web, phone, SMS and email engagement with tour scheduling and CRM connections.', tradeoff: 'Further is an engagement platform rather than a replacement prospect system of record.' },
      { vendor: 'quid', reason: 'Focused inquiry response, tour coordination and approved follow-up without CRM migration.', tradeoff: 'Referral management and broad CRM reporting are outside Quid’s standard scope.' },
    ],
  },
  {
    slug: 'advantage-anywhere-alternatives',
    target: 'advantage-anywhere',
    titleName: 'Advantage Anywhere Alternatives',
    description: 'Compare five Advantage Anywhere alternatives for senior living CRM, marketing automation, tours, reporting and focused admissions follow-up in 2026.',
    opening: 'Advantage Anywhere alternatives include purpose-built senior living CRMs, an AI sales and marketing platform, and focused admissions automation. Buyers should separate the need for customization and portfolio reporting from the need for faster inquiry response.',
    direct: 'Consider Aline, ECP or WelcomeHome when choosing another senior living CRM model, Further when the existing CRM can remain and multi-channel AI engagement is needed, or Quid for one community testing a focused website-inquiry-to-tour workflow.',
    targetStillFits: 'Advantage Anywhere may remain the stronger shortlist choice when the operator wants customizable lead-to-lease CRM, marketing automation, census visibility and reporting for an individual community or portfolio.',
    decisionPrompt: 'Does the operator need a customizable CRM, stronger clinical or referral connections, broad engagement channels, or a smaller inquiry-to-tour implementation?',
    candidates: [
      { vendor: 'aline', reason: 'Purpose-built senior living CRM with connected sales, marketing and operating products.', tradeoff: 'Confirm the modules, tier, migration and reporting architecture required.' },
      { vendor: 'ecp', reason: 'Assisted living CRM with tours, follow-up and connections into the ECP care platform.', tradeoff: 'The choice may bring broader platform implications than a standalone CRM change.' },
      { vendor: 'welcomehome', reason: 'Prospect- and referrer-centered senior living CRM with in-platform communications.', tradeoff: 'Confirm data migration, integrations, reporting and escalation behavior.' },
      { vendor: 'further', reason: 'AI engagement across web, phone, SMS and email with tour scheduling.', tradeoff: 'It connects to a CRM instead of replacing the system of record.' },
      { vendor: 'quid', reason: 'A narrow, managed inquiry-to-tour workflow around the tools already in place.', tradeoff: 'Quid is not a complete CRM, marketing platform or portfolio reporting system.' },
    ],
  },
];

export const alternativeBySlug = Object.fromEntries(alternatives.map((item) => [item.slug, item])) as Record<string, AlternativePage>;
export const alternativePath = (slug: string) => `/resources/alternatives/${slug}/`;
