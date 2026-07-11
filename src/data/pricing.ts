export const pricing = {
  pilot: {
    name: '30-Day Quid Admissions Pilot',
    amount: 1000,
    display: '$1,000',
    billing: 'one-time',
    displayWithBilling: '$1,000 one-time',
  },
  ongoing: {
    amount: 899,
    display: '$899/month per community',
    monthlyDisplay: '$899/month per community',
    billing: 'monthly per community',
    continuationLine: 'Continue with managed Quid operations for $899/month per community.',
    afterPilotDisplay: '$899/month per community after pilot',
  },
} as const;
