import { pricing } from './pricing';

export interface SiteConfig {
  brandName: string;
  domain: string;
  legalCompanyName?: string;
  contactEmail?: string;
  bookingUrl?: string;
  formAction?: string;
  socialProfiles: Record<string, string>;
  pilotAvailable: boolean;
  pricing?: string;
  analyticsDomain?: string;
  defaultTitle: string;
  defaultDescription: string;
}

const clean = (value?: string) => value?.trim() || undefined;

export const site: SiteConfig = {
  brandName: 'Quid',
  domain: clean(import.meta.env.PUBLIC_SITE_URL) || 'https://get-quid.site',
  legalCompanyName: clean(import.meta.env.PUBLIC_LEGAL_COMPANY_NAME),
  contactEmail: clean(import.meta.env.PUBLIC_CONTACT_EMAIL),
  bookingUrl: clean(import.meta.env.PUBLIC_BOOKING_URL),
  formAction: clean(import.meta.env.PUBLIC_FORM_ACTION),
  socialProfiles: {},
  pilotAvailable: true,
  pricing: pricing.pilot.displayWithBilling,
  analyticsDomain: clean(import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN),
  defaultTitle: 'Quid | AI Admissions Concierge for Senior Living',
  defaultDescription:
    'Quid helps senior living teams respond to website inquiries, coordinate tours, manage follow-up, and route sensitive questions to staff.',
};

export const primaryCtaHref = '/meet-quid';
