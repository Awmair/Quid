export const pricing = {
  pilot: {
    name: '30-Day Quid Admissions Pilot',
    amount: 2499,
    display: '$2,499',
    billing: 'one-time',
    displayWithBilling: '$2,499 one-time',
  },
  ongoing: {
    amount: 3999,
    display: 'From $3,999/month',
    monthlyDisplay: '$3,999/month',
    billing: 'monthly',
    continuationLine: 'Continue with managed Quid operations from $3,999/month.',
    afterPilotDisplay: 'From $3,999/month after pilot',
  },
} as const;
