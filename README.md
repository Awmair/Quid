# Quid website

Production-ready static marketing website for **Quid**, the behind-the-scenes inquiry follow-up and tour scheduling service for senior living communities. The site is built with Astro and deploys free through GitHub Pages at `https://get-quid.site`.

## Technology

- Astro static output and TypeScript
- Astro content collections for resource guides
- Astro Image for responsive WebP mascot assets
- Local Manrope and Newsreader variable fonts
- Minimal vanilla TypeScript for navigation, reveals, and the calculator
- GitHub Actions and GitHub Pages
- No backend, database, server functions, paid CMS, or paid runtime service

## Install and run locally

```bash
npm install
npm run dev
```

Astro prints the local preview URL. For a production validation and build:

```bash
npm run build
npm run test:site
npm run seo:check
npm run preview
```

## GitHub Pages deployment

1. Push the repository to GitHub with the production branch named `main`.
2. In **Settings → Pages**, choose **GitHub Actions** as the source.
3. The workflow in `.github/workflows/deploy.yml` validates, builds, uploads, and deploys the `dist` artifact on every push to `main`. It can also be run manually.
4. Commit `package-lock.json`; the official Astro action uses it to select npm.

The workflow follows the current official Astro GitHub Pages pattern using `withastro/action` and `actions/deploy-pages`.

## Custom domain and DNS

`public/CNAME` contains `get-quid.site`, and `astro.config.mjs` uses `https://get-quid.site` without a base path.

At the DNS provider, configure the apex domain with GitHub Pages’ current documented A/AAAA records, or use a `CNAME` for a subdomain if the domain plan changes. Confirm the exact records in GitHub’s current custom-domain documentation before editing DNS. In repository Pages settings, add `get-quid.site`, wait for DNS verification, then enable **Enforce HTTPS**.

## Environment variables

Copy `.env.example` to `.env` for local configuration. Public values are compiled into the static site:

- `PUBLIC_SITE_URL`: canonical site URL; defaults to `https://get-quid.site`
- `PUBLIC_BOOKING_URL`: optional external walkthrough calendar shown on `/meet-quid`
- `PUBLIC_FORM_ACTION`: external static-form endpoint
- `PUBLIC_CONTACT_EMAIL`: visible email and mailto fallback
- `PUBLIC_LEGAL_COMPANY_NAME`: legal copyright entity
- `PUBLIC_PLAUSIBLE_DOMAIN`: optional privacy-conscious analytics domain

Do not put secrets in `PUBLIC_` variables.

## Booking, forms, and email fallback

The See How Quid Fits walkthrough request and pilot application forms submit directly to Formspree and remain usable without JavaScript. When `PUBLIC_BOOKING_URL` is configured, the walkthrough page also offers the external booking calendar.

Never collect resident names, diagnoses, medication information, medical records, protected health information, Social Security numbers, or payment-card data through these forms.

## Brand and mascot assets

Approved production assets are in `src/assets/brand/`. Astro generates responsive optimized formats during the build. Replace an image only with an approved Quid asset that preserves the canonical mascot identity. Keep filenames stable or update imports in `src/components/Mascot.astro`.

The original full brand pack is intentionally ignored by Git because the curated web assets are already included. Brand and animation rules live in `art-direction/brand-notes.md`; future image briefs live in `art-direction/image-prompts.md`.

## Add a resource guide

1. Add a Markdown file to `src/content/resources/`.
2. Include `title`, `description`, `author`, `publishedDate`, `updatedDate`, and `order` frontmatter.
3. Use descriptive H2 headings; the article template generates the table of contents and JSON-LD.
4. Add accurate internal links and run the full build and site check.

## Metadata and structured data

Global metadata is handled by `src/layouts/BaseLayout.astro`. Page titles, descriptions, canonical URLs, Open Graph metadata, and Twitter/X cards are supplied by each page. Homepage, resource, article, contact, breadcrumb, and visible FAQ structured data are generated in the relevant page components. Update visible content and matching schema together.

## SEO and crawl QA

Run the production build before the SEO check:

```bash
npm run build
npm run seo:check
```

The check verifies one H1 per HTML page, unique titles and descriptions, canonical and social metadata, valid JSON-LD, internal links, required routes, sitemap coverage, RSS, `robots.txt`, `llms.txt`, and `llms-full.txt`. It also flags lorem ipsum, unexpected `noindex`, missing crawl files, and a 404 URL accidentally entering the sitemap.

`public/llms.txt` and `public/llms-full.txt` provide optional public-site clarity for AI systems. They do not replace foundational SEO and are not treated as Google ranking controls.

## Optional analytics

Set `PUBLIC_PLAUSIBLE_DOMAIN` only after selecting and approving a privacy-conscious analytics setup. The site works completely without analytics. Advertising pixels, heatmaps, and session replay are not installed.

## Accessibility

The site targets WCAG 2.2 AA with a skip link, semantic landmarks, keyboard navigation, focus trapping and Escape behavior in the mobile menu, visible focus, labelled inputs, touch targets, reduced-motion support, meaningful image alternatives, and non-color-only status cues.

## Legal review required

`/privacy` and `/terms` are starter marketing-site documents, not legal advice. Before launch, counsel should review and complete the legal company identity, privacy contact, provider disclosures, retention details, governing law, and service-specific terms. Review the production workflow, vendors, data handling, and sensitive-information boundaries separately.
