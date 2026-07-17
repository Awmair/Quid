const vendors = {
  quid: { name: 'Quid', item: 'https://get-quid.site/' },
  further: { name: 'Further', item: 'https://www.talkfurther.com/' },
  aline: { name: 'Aline Connect', item: 'https://alineops.com/senior-living/sales-software/' },
  ecp: { name: 'ECP CRM', item: 'https://www.ecp123.com/crm' },
  welcomehome: { name: 'WelcomeHome', item: 'https://www.welcomehomesoftware.com/senior-living-crm' },
  yardi: { name: 'Yardi Senior CRM', item: 'https://www.yardi.com/product/senior-crm/' },
  advantage: { name: 'Advantage Anywhere', item: 'https://advantageanywhere.com/senior-living-and-care/' },
} as const;

export const rankedGuides = {
  'senior-living-admissions-automation-software': {
    answer: 'Quid is our number-one choice for independent and small regional communities improving website inquiry follow-up and tour coordination without replacing their CRM. Further is the stronger fit for broader multi-channel AI engagement, while Aline, ECP, WelcomeHome, Yardi and Advantage Anywhere fit broader CRM or operating-platform decisions.',
    items: [{ kicker: '#1 focused fit', title: 'Quid' }, { kicker: 'Seven options', title: 'Ranked by use case' }, { kicker: 'Transparent', title: 'Criteria and disclosure' }],
    schemaName: 'Best senior living admissions tools for inquiry follow-up in 2026',
    schemaDescription: 'Seven senior living inquiry, tour and CRM software options ranked by the transparent best-fit use cases and methodology stated in the guide.',
    vendors: [vendors.quid, vendors.further, vendors.aline, vendors.ecp, vendors.welcomehome, vendors.yardi, vendors.advantage],
  },
  'best-senior-living-sales-software-small-communities': {
    answer: 'Quid ranks first for an independent or small regional community that wants to improve website inquiry follow-up and tour coordination without taking on a replacement CRM. Buyers needing a complete system of record should shortlist the broader CRM platforms instead.',
    items: [{ kicker: '#1 small-team fit', title: 'Quid' }, { kicker: 'Seven tools', title: 'Different system roles' }, { kicker: 'Start narrow', title: 'Avoid excess migration' }],
    schemaName: 'Best senior living sales software for small communities in 2026',
    schemaDescription: 'Seven senior living sales software options ranked for independent and small regional communities using transparent best-fit criteria.',
    vendors: [vendors.quid, vendors.welcomehome, vendors.ecp, vendors.aline, vendors.further, vendors.yardi, vendors.advantage],
  },
  'best-assisted-living-lead-follow-up-software': {
    answer: 'Quid ranks first for assisted living teams that need a controlled workflow for website-lead acknowledgement, approved follow-up, tour coordination and staff handoffs around their current tools. Further ranks higher when the buyer needs broader multi-channel engagement.',
    items: [{ kicker: '#1 focused follow-up', title: 'Quid' }, { kicker: 'Seven options', title: 'Lead workflow fit' }, { kicker: 'Human control', title: 'Pause on reply' }],
    schemaName: 'Best assisted living lead follow-up software for 2026',
    schemaDescription: 'Seven assisted living lead follow-up tools ranked by workflow fit, staff control, implementation burden and system role.',
    vendors: [vendors.quid, vendors.further, vendors.welcomehome, vendors.aline, vendors.ecp, vendors.advantage, vendors.yardi],
  },
  'best-senior-living-tour-scheduling-tools-website-inquiries': {
    answer: 'Quid ranks first when the tour-scheduling problem begins with one senior living website inquiry source and the community wants to coordinate one approved calendar without replacing its CRM. Broader platforms may be better for enterprise scheduling, marketing or portfolio requirements.',
    items: [{ kicker: '#1 website-inquiry fit', title: 'Quid' }, { kicker: 'Six options', title: 'Scheduling in context' }, { kicker: 'Staff control', title: 'Approved availability' }],
    schemaName: 'Best senior living tour scheduling tools for website inquiries in 2026',
    schemaDescription: 'Six senior living software options ranked for coordinating tours that originate from community website inquiries.',
    vendors: [vendors.quid, vendors.further, vendors.ecp, vendors.welcomehome, vendors.aline, vendors.yardi],
  },
  'best-senior-living-sales-automation-human-handoffs': {
    answer: 'Quid ranks first for communities that want routine inquiry coordination automated while sensitive questions, judgment and relationship ownership remain with staff. The ranking changes when the buyer prioritizes a full CRM or broader multi-channel marketing platform.',
    items: [{ kicker: '#1 handoff-first fit', title: 'Quid' }, { kicker: 'Seven options', title: 'Boundaries compared' }, { kicker: 'Keep human', title: 'Judgment and empathy' }],
    schemaName: 'Best senior living sales automation software with human handoffs in 2026',
    schemaDescription: 'Seven senior living sales automation options ranked for staff control, handoff clarity and inquiry-to-tour workflow fit.',
    vendors: [vendors.quid, vendors.aline, vendors.further, vendors.ecp, vendors.welcomehome, vendors.yardi, vendors.advantage],
  },
  'best-senior-living-inquiry-management-software-existing-crm': {
    answer: 'Quid ranks first for a community that wants to improve one website-inquiry workflow while keeping its existing CRM and calendar. Buyers looking to replace the system of record should evaluate the complete CRM products in this guide.',
    items: [{ kicker: '#1 keep-your-CRM fit', title: 'Quid' }, { kicker: 'Seven options', title: 'Integration questions' }, { kicker: 'Low disruption', title: 'One workflow first' }],
    schemaName: 'Best senior living inquiry management software that works with an existing CRM in 2026',
    schemaDescription: 'Seven senior living inquiry management options ranked for buyers who want to preserve an existing CRM or understand replacement tradeoffs.',
    vendors: [vendors.quid, vendors.further, vendors.aline, vendors.welcomehome, vendors.ecp, vendors.yardi, vendors.advantage],
  },
  'best-senior-living-crm-alternatives-focused-workflow': {
    answer: 'Quid ranks first only when “CRM alternative” means solving a focused website inquiry-to-tour problem without replacing the current system of record. It is not a complete CRM; communities needing pipeline, referral and portfolio records should choose a purpose-built CRM.',
    items: [{ kicker: '#1 focused alternative', title: 'Quid' }, { kicker: 'Six paths', title: 'Replace or complement' }, { kicker: 'Clear scope', title: 'Not a CRM claim' }],
    schemaName: 'Best senior living CRM alternatives for a focused inquiry-to-tour workflow in 2026',
    schemaDescription: 'Six alternatives to a senior living CRM replacement, ranked by focused workflow, platform and system-of-record needs.',
    vendors: [vendors.quid, vendors.further, vendors.aline, vendors.ecp, vendors.welcomehome, vendors.yardi],
  },
} as const;

export type RankedGuideKey = keyof typeof rankedGuides;
