/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_BOOKING_URL?: string;
  readonly PUBLIC_FORM_ACTION?: string;
  readonly PUBLIC_CONTACT_EMAIL?: string;
  readonly PUBLIC_LEGAL_COMPANY_NAME?: string;
  readonly PUBLIC_PLAUSIBLE_DOMAIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
