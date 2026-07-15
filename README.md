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
3. The workflow in `.github/workflows/deploy.yml` builds and runs the full Search Console/SEO regression check on pull requests to `main`.
4. A push to `main`, or a manual workflow run, repeats the validation and deploys the generated `dist` artifact to GitHub Pages.
5. Commit `package-lock.json`; the official Astro action uses the lockfile to select npm.

The workflow follows Astro’s official GitHub Pages pattern with `withastro/action` and `actions/deploy-pages`. Public configuration values can be stored as GitHub repository variables with names matching the `PUBLIC_` variables below.

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
- `PUBLIC_GOOGLE_SITE_VERIFICATION`: optional Google URL-prefix verification token; enter only the token value, not a complete `<meta>` element

Do not put secrets in `PUBLIC_` variables. Search Console verification tokens are public by design, but DNS verification is preferred for the domain property because it covers all protocols and subdomains.

## Google Search Console setup and operating checklist

The repository handles the technical portion of Search Console readiness. Console ownership, DNS verification, sitemap submission, URL inspection, and report review still happen in Google Search Console.

1. Create or retain a **Domain property** for `get-quid.site` and verify it with the DNS TXT record Google supplies.
2. As an optional backup, create a URL-prefix property for `https://get-quid.site/`, store its HTML-tag token in the repository variable `PUBLIC_GOOGLE_SITE_VERIFICATION`, and redeploy.
3. Submit `https://get-quid.site/sitemap-index.xml` in the Sitemaps report. The same sitemap is declared in `robots.txt` and in every page head.
4. Inspect the homepage, `/solutions/`, the three solution pages, `/pilot/`, the inquiry-flow grader, the software-comparison hub, and the original benchmark resource after major releases.
5. Review Page indexing, Crawl stats, Core Web Vitals, HTTPS, Manual actions, Security issues, and Enhancements after deployment. Resolve template-level problems in code rather than validating URLs one by one.
6. Compare submitted versus indexed sitemap URLs and investigate exclusions by reason. Do not request indexing for low-value duplicates or URLs intentionally marked `noindex`.
7. Re-submit the sitemap only when its location changes or Google reports a fetch problem; normal content updates are discovered through the existing sitemap and internal links.

The sitemap intentionally omits a global `<lastmod>` value. A single deployment date applied to every URL would be inaccurate. Add per-page dates through the sitemap integration’s `serialize()` hook only when there is a maintained source of truth for each page’s last significant update.

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
5. Update the page’s `updatedDate` only after a significant content, structured-data, or internal-link change—not for a cosmetic or copyright-only edit.

## Metadata and structured data

Global metadata is handled by `src/layouts/BaseLayout.astro`. Page titles, descriptions, canonical URLs, Open Graph metadata, Twitter/X cards, sitemap discovery, optional Search Console verification, and the canonical Organization/WebSite entity graph are generated there. Resource guides, comparison pages, alternative guides, contact pages, breadcrumbs, services, datasets, collections, and visible FAQs add page-specific structured data. Update visible content and matching schema together.

## Search Console and crawl QA

Run the production build before the check:

```bash
npm run build
npm run seo:check
```

The check validates:

- one H1, unique titles, and unique descriptions
- canonical URLs, index/noindex directives, Open Graph/Twitter metadata, and social-image alternatives
- valid JSON-LD, canonical Organization/WebSite entities, Article metadata, linked intermediate breadcrumbs, and resolvable local schema URLs
- exact parity between indexable canonicals and sitemap URLs, with no duplicates, orphans, noindex entries, fake site-wide dates, or future dates
- canonical internal links, required routes, RSS, `robots.txt`, the sitemap index, CNAME, and downloadable research assets
- exclusion of the 404 and private utility routes from the sitemap

`public/llms.txt` and `public/llms-full.txt` provide optional public-site clarity for AI systems. They do not replace foundational SEO and are not treated as Google ranking controls.

## Optional analytics

Set `PUBLIC_PLAUSIBLE_DOMAIN` only after selecting and approving a privacy-conscious analytics setup. The site works completely without analytics. Advertising pixels, heatmaps, and session replay are not installed.

## Accessibility

The site targets WCAG 2.2 AA with a skip link, semantic landmarks, keyboard navigation, focus trapping and Escape behavior in the mobile menu, visible focus, labelled inputs, touch targets, reduced-motion support, meaningful image alternatives, and non-color-only status cues.

## Legal review required

`/privacy` and `/terms` are starter marketing-site documents, not legal advice. Before launch, counsel should review and complete the legal company identity, privacy contact, provider disclosures, retention details, governing law, and service-specific terms. Review the production workflow, vendors, data handling, and sensitive-information boundaries separately.
