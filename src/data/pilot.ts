import { pricing } from './pricing';

export const pilotOffer = {
  name: pricing.pilot.name,
  cardTitle: pricing.pilot.name,
  headline: 'See what Quid can take off your team’s plate.',
  pageHeadline: 'Thirty days to see what Quid can handle behind the scenes.',
  price: pricing.pilot.amount,
  priceLabel: pricing.pilot.display,
  priceQualifier: pricing.pilot.billing,
  priceWithBilling: pricing.pilot.displayWithBilling,
  continuationPrice: pricing.ongoing.display,
  ongoingPriceLabel: pricing.ongoing.monthlyDisplay,
  continuation: pricing.ongoing.continuationLine,
  cardContinuation: `Keep Quid for ${pricing.ongoing.monthlyDisplay} after the pilot.`,
  applicationContinuation: `Continue for ${pricing.ongoing.monthlyDisplay} after the pilot.`,
  scope: 'One community, one inquiry source, and one tour calendar.',
  positioning:
    'This is a paid implementation pilot—not a free trial or refundable deposit.',
  homepageBody:
    'Over 30 days, we learn how your admissions team works, set up Quid around that process, run one focused workflow, and show what Quid handled behind the scenes.',
  pageBody:
    'We learn your current admissions process, set up one inquiry-to-tour workflow, run it carefully, and show whether fewer inquiries were missed, more tours were booked, and staff spent less time chasing routine work.',
  processLine: 'Understand. Set up. Run. Measure.',
  outcomeLine:
    'By the end, you will know what Quid handled, what your team handled, and whether it is worth continuing.',
  trustLine:
    'No long-term commitment is required to complete the pilot.',
  includes: [
    'Current workflow review',
    'Approved response and follow-up flow',
    'Human-handoff rules',
    'Controlled implementation',
    'Optional manager and exception view',
    'Daily admissions summary',
    'Monitoring and tuning',
    'End-of-pilot report',
  ],
  excludes: [
    'Phone agent',
    'SMS automation',
    'Full CRM replacement',
    'Multi-location rollout',
    'Clinical workflow automation',
    'Complex integrations',
  ],
  fullExcludes: [
    'Inbound phone answering',
    'SMS campaigns',
    'Full CRM replacement',
    'Multi-location routing',
    'Clinical assessments',
    'Medication or care-plan workflows',
    'Billing workflows',
    'Complex integrations',
  ],
  clientNeeds: [
    'One main staff contact',
    'Your inquiry form or inquiry path',
    'Your tour scheduling process',
    'Approved message language',
    'Your human-handoff rules',
    'One weekly review call',
    'Honest feedback when something feels off',
  ],
  endReport: [
    'What Quid handled',
    'What your team handled',
    'Where follow-up became clearer',
    'Where staff still needed to step in',
    'Workflow issues found',
    'Whether continuing makes operational sense',
  ],
  ongoingIncludes: [
    'Workflow monitoring',
    'Issue resolution',
    'Message and rule updates',
    'Manager and exception reporting',
    'Operational support',
    'Continued optimization',
  ],
  continuationFoundation:
    'The pilot configuration becomes the foundation of your ongoing Quid service, so your team does not start over.',
  ongoingPricingNote:
    'Ongoing service is priced per community.',
  measurements: [
    'Inquiries acknowledged',
    'Tours offered',
    'Tours booked',
    'Follow-ups sent',
    'Human handoffs',
    'Overdue items',
    'Staff feedback',
    'Workflow issues',
  ],
  pilotQuestions: [
    'Can Quid fit your current admissions process?',
    'Can Quid make follow-up more consistent?',
    'Is it worth keeping after 30 days?',
  ],
} as const;

export const pilotWeeks = [
  {
    week: 'Week 1',
    icon: '01',
    previewTitle: 'Understand',
    title: 'We understand your admissions workflow',
    preview:
      'We map how inquiries, tours, follow-up, and staff handoffs work today.',
    detail: 'We map how inquiries, tours, follow-up, and staff handoffs work today.',
    actionLabel: 'We review',
    actions: ['Where inquiries go', 'Who responds first', 'How tours are scheduled', 'What tools you use', 'Where leads go cold', 'What must go to a human'],
    deliverables: ['Workflow map', 'Tool review', 'Pilot scope', 'Handoff points'],
    output: ['Workflow map', 'Pilot scope', 'Tool list', 'Handoff list'],
  },
  {
    week: 'Week 2',
    icon: '02',
    previewTitle: 'Set up',
    title: 'We set up Quid with your staff',
    preview:
      'We refine the workflow with one staff member and approve messages, timing, and handoff rules.',
    detail: 'We refine the workflow with one staff member and approve messages, timing, and handoff rules.',
    actionLabel: 'We define',
    actions: ['What Quid says first', 'When tour options are offered', 'What happens after a tour', 'When follow-up pauses', 'Who gets notified', 'What the dashboard shows'],
    deliverables: ['Approved messages', 'Follow-up timing', 'Handoff rules', 'Dashboard fields'],
    output: ['Approved messages', 'Follow-up timing', 'Handoff rules', 'Dashboard layout', 'Launch checklist'],
  },
  {
    week: 'Week 3',
    icon: '03',
    previewTitle: 'Run',
    title: 'We run the focused workflow',
    preview:
      'Quid goes live for one inquiry source and one tour calendar.',
    detail: 'Quid goes live for one inquiry source and one tour calendar.',
    actionLabel: 'We set up',
    actions: ['Inquiry capture', 'Approved acknowledgement', 'Tour coordination flow', 'Follow-up sequence', 'Dashboard', 'Staff alerts', 'Daily summary'],
    deliverables: ['Live pilot workflow', 'Dashboard', 'Daily summary', 'Staff alerts'],
    output: ['Live controlled workflow', 'Working dashboard', 'Test records', 'Issue log'],
  },
  {
    week: 'Week 4',
    icon: '04',
    previewTitle: 'Measure',
    title: 'We measure the workflow',
    preview:
      'We monitor the workflow and report what Quid handled, what staff handled, and what should happen next.',
    detail: 'We monitor the workflow and report what Quid handled, what staff handled, and what should happen next.',
    actionLabel: 'We review',
    actions: ['Inquiries acknowledged', 'Tours offered', 'Tours booked', 'Follow-ups sent', 'Human handoffs', 'Overdue items', 'Staff feedback', 'Workflow issues'],
    deliverables: ['Pilot report', 'Workflow findings', 'Staff feedback', 'Continuation recommendation'],
    output: ['End-of-pilot report', 'Continuation recommendation', 'Expansion options'],
  },
] as const;

export const pilotFaqs = [
  ['How much does the pilot cost?', `The 30-day Quid Admissions Pilot costs ${pricing.pilot.displayWithBilling}.`],
  ['What is included?', 'We review your current process, set up one inquiry workflow, provide an optional manager view and daily summary, monitor the workflow, and deliver an end-of-pilot report.'],
  ['Is the pilot fee credited if we continue?', 'No. The pilot is a standalone implementation and deployment engagement. If you continue, the work completed during the pilot becomes the foundation of your managed Quid service.'],
  ['What does Quid cost after the pilot?', `Managed Quid operations cost ${pricing.ongoing.monthlyDisplay}. You decide whether to continue after the pilot.`],
  ['Do we have to continue?', 'No. At the end of the pilot, you decide whether the workflow is useful enough to keep.'],
  ['When does Quid go live?', 'Quid normally goes live during Week 3, after the workflow and handoff rules have been reviewed.'],
] as const;
