import admissionsAutomation from '../assets/resources/admissions-automation-guide.webp';
import inquiryResponseTime from '../assets/resources/inquiry-response-time-guide.webp';
import tourFollowUp from '../assets/resources/tour-follow-up-guide.webp';
import dailyAdmissionsSummary from '../assets/resources/daily-admissions-summary-guide.webp';
import humanHandoffChecklist from '../assets/resources/human-handoff-checklist-guide.webp';
import followUpTemplates from '../assets/resources/follow-up-templates-guide.webp';
import softwareBuyersGuide from '../assets/resources/senior-living-admissions-software-buyers-guide.webp';
import assistedLivingOccupancy from '../assets/resources/assisted-living-occupancy-guide.webp';
import inquiryToTourAudit from '../assets/resources/senior-living-inquiry-to-tour-audit.webp';
import smallCommunitySales from '../assets/resources/senior-living-sales-small-communities-photo.webp';
import assistedLivingLeadFollowUp from '../assets/resources/assisted-living-lead-follow-up-photo.webp';
import tourScheduling from '../assets/resources/senior-living-tour-scheduling-photo.webp';
import humanHandoff from '../assets/resources/senior-living-human-handoff-photo.webp';
import existingCrm from '../assets/resources/senior-living-existing-crm-photo.webp';
import crmAlternatives from '../assets/resources/senior-living-crm-alternatives-photo.webp';

export const resourceMedia = {
  'how-to-increase-assisted-living-occupancy': {
    image: assistedLivingOccupancy,
    alt: 'A community director and maintenance lead measuring an assisted living apartment before a family visit',
  },
  'senior-living-admissions-automation': {
    image: admissionsAutomation,
    alt: 'Three admissions coworkers mapping an inquiry workflow with paper slips on a used conference table',
  },
  'senior-living-inquiry-response-time': {
    image: inquiryResponseTime,
    alt: 'A night receptionist returning a new senior living inquiry from the community front desk',
  },
  'senior-living-inquiry-to-tour-audit': {
    image: inquiryToTourAudit,
    alt: 'Two admissions coworkers auditing the steps between a website inquiry and a community tour',
  },
  'senior-living-tour-follow-up': {
    image: tourFollowUp,
    alt: 'An admissions counselor recording notes on a hallway bench immediately after a family tour',
  },
  'senior-living-daily-admissions-summary': {
    image: dailyAdmissionsSummary,
    alt: 'A community executive director reading the morning admissions summary in a staff break room',
  },
  'senior-living-human-handoff-checklist': {
    image: humanHandoffChecklist,
    alt: 'A front-desk coordinator handing a sensitive inquiry note to an admissions director',
  },
  'senior-living-follow-up-templates': {
    image: followUpTemplates,
    alt: 'An admissions coordinator marking up a family follow-up template before sending it',
  },
  'senior-living-admissions-automation-software': {
    image: softwareBuyersGuide,
    alt: 'Two community leaders testing senior living admissions software on an older laptop and tablet',
  },
  'best-senior-living-sales-software-small-communities': {
    image: smallCommunitySales,
    alt: 'Two small-community leaders reviewing inquiry notes and sales software in a working office',
  },
  'best-assisted-living-lead-follow-up-software': {
    image: assistedLivingLeadFollowUp,
    alt: 'An assisted living admissions coordinator matching a voicemail to a callback note',
  },
  'best-senior-living-tour-scheduling-tools-website-inquiries': {
    image: tourScheduling,
    alt: 'Two community staff coordinating a tour change with a wall calendar, phone, and keys',
  },
  'best-senior-living-sales-automation-human-handoffs': {
    image: humanHandoff,
    alt: 'An admissions coordinator briefing a nursing director during a human handoff',
  },
  'best-senior-living-inquiry-management-software-existing-crm': {
    image: existingCrm,
    alt: 'A community sales director reconciling inquiry notes with an existing CRM',
  },
  'best-senior-living-crm-alternatives-focused-workflow': {
    image: crmAlternatives,
    alt: 'Two community leaders simplifying an admissions workflow on a mobile whiteboard',
  },
} as const;
