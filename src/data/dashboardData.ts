export interface DashboardStat {
  value: string;
  label: string;
  icon: string;
}

export interface DashboardCard {
  name: string;
  details: Array<[string, string]>;
  status: string;
  nextAction?: string;
}

export interface DashboardColumn {
  id: string;
  label: string;
  cards: DashboardCard[];
}

export const dashboardStats: DashboardStat[] = [
  { value: '4', label: 'new inquiries', icon: '+' },
  { value: '2', label: 'tours booked', icon: '▦' },
  { value: '3', label: 'reminders sent', icon: '✓' },
  { value: '1', label: 'human review needed', icon: '!' },
];

export const dashboardColumns: DashboardColumn[] = [
  {
    id: 'new',
    label: 'New',
    cards: [{
      name: 'Sarah M.',
      details: [['Interest', 'Memory Care'], ['Source', 'Website inquiry']],
      status: 'Acknowledged by Quid',
      nextAction: 'Tour options sent',
    }],
  },
  {
    id: 'offered',
    label: 'Tour Offered',
    cards: [{
      name: 'David R.',
      details: [['Interest', 'Assisted Living'], ['Source', 'Contact form']],
      status: 'Waiting for family to choose time',
      nextAction: 'Follow-up scheduled',
    }],
  },
  {
    id: 'booked',
    label: 'Tour Booked',
    cards: [{
      name: 'Maria L.',
      details: [['Interest', 'Independent Living'], ['Tour', 'Thursday, 11:00 AM'], ['Assigned to', 'Lisa']],
      status: 'Reminder scheduled',
    }],
  },
  {
    id: 'attention',
    label: 'Needs Attention',
    cards: [{
      name: 'James K.',
      details: [['Reason', 'Care eligibility question detected'], ['Assigned to', 'Admissions Director']],
      status: 'Human review required',
    }],
  },
  {
    id: 'followup',
    label: 'Follow-Up Active',
    cards: [{
      name: 'Elaine P.',
      details: [['Stage', 'Day 3 post-tour follow-up']],
      status: 'Active',
      nextAction: 'Decision-stage check-in',
    }],
  },
];

export const dashboardCallouts = [
  { number: '01', title: 'New inquiries', text: 'See who reached out, where they came from, and whether Quid acknowledged them.', target: 'new' },
  { number: '02', title: 'Tour movement', text: 'See which families received tour options and which visits are booked.', target: 'booked' },
  { number: '03', title: 'Follow-up status', text: 'See where each family is in the approved follow-up sequence.', target: 'followup' },
  { number: '04', title: 'Human handoffs', text: 'See anything Quid should not handle automatically.', target: 'attention' },
  { number: '05', title: 'Daily summary', text: 'See what needs attention without opening five different tools.', target: 'summary' },
] as const;

export const inquiryFlow = [
  { icon: '+', title: 'Inquiry submitted', text: 'Website form' },
  { icon: '✓', title: 'Acknowledgement sent', text: 'Approved language' },
  { icon: '▦', title: 'Tour options offered', text: 'Available times only' },
  { icon: '→', title: 'Tour booked', text: 'Calendar updated' },
  { icon: '◷', title: 'Reminder sent', text: 'On schedule' },
  { icon: '●', title: 'Outcome marked', text: 'Staff update' },
  { icon: '↻', title: 'Follow-up begins', text: 'Approved sequence' },
  { icon: '!', title: 'Human review', text: 'When needed' },
] as const;

export const dailySummary = {
  title: 'Good morning, Lisa.',
  body: 'Quid found 4 new inquiries, 2 tours booked this week, 3 reminders sent, and 1 family waiting for your reply.',
  actions: [
    'Review James K. handoff',
    'Confirm Maria L. tour room',
    'Check David R. if no reply by tomorrow',
    'Review Day 3 follow-up for Elaine P.',
  ],
} as const;

export const handoffSpotlight = {
  title: 'Human review required',
  reason: 'Care eligibility question detected',
  assignedTo: 'Admissions Director',
  acknowledgement: 'Thank you for sharing that information. A member of our team is the right person to help with this question and will follow up with you directly.',
} as const;
