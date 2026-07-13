import admissionsAutomation from '../assets/resources/admissions-automation-guide.png';
import inquiryResponseTime from '../assets/resources/inquiry-response-time-guide.png';
import tourFollowUp from '../assets/resources/tour-follow-up-guide.png';
import dailyAdmissionsSummary from '../assets/resources/daily-admissions-summary-guide.png';
import humanHandoffChecklist from '../assets/resources/human-handoff-checklist-guide.png';
import followUpTemplates from '../assets/resources/follow-up-templates-guide.png';
import softwareBuyersGuide from '../assets/resources/senior-living-admissions-software-buyers-guide.png';
import familyTour from '../assets/lifestyle/family-tour.png';

export const resourceMedia = {
  'how-to-increase-assisted-living-occupancy': {
    image: familyTour,
    alt: 'A senior living sales director welcoming a family for a scheduled assisted living community tour',
  },
  'senior-living-admissions-automation': {
    image: admissionsAutomation,
    alt: 'A diverse admissions team arranging a senior living follow-up workflow together',
  },
  'senior-living-inquiry-response-time': {
    image: inquiryResponseTime,
    alt: 'An admissions coordinator promptly responding to a new senior living inquiry',
  },
  'senior-living-inquiry-to-tour-audit': {
    image: inquiryResponseTime,
    alt: 'An admissions coordinator reviewing a senior living website inquiry journey',
  },
  'senior-living-tour-follow-up': {
    image: tourFollowUp,
    alt: 'A family discussing next steps with an admissions director after a senior living tour',
  },
  'senior-living-daily-admissions-summary': {
    image: dailyAdmissionsSummary,
    alt: 'A diverse senior living admissions team reviewing the day’s priorities together',
  },
  'senior-living-human-handoff-checklist': {
    image: humanHandoffChecklist,
    alt: 'An admissions coordinator handing a sensitive inquiry to a resident-services colleague',
  },
  'senior-living-follow-up-templates': {
    image: followUpTemplates,
    alt: 'An admissions professional personalizing an approved family follow-up message',
  },
  'senior-living-admissions-automation-software': {
    image: softwareBuyersGuide,
    alt: 'A senior living executive director and admissions director comparing software options together',
  },
} as const;
