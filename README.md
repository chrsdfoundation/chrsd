# CHRSD Foundation — Website

A production-ready [Astro](https://astro.build) website for the **Centre for
Humanitarian Research and Social Development (CHRSD) Foundation**, with content managed
through [Decap CMS](https://decapcms.org) (the open-source successor to Netlify CMS).

Built to the CHRSD Blueprint V2: institutional green / earth-tone palette, accessible
mega-menu navigation, a hero carousel, count-up impact statistics, a projects
collection, a blog, a news/press room, and a contact form.

---

## Quick start

```bash
npm install
npm run dev
```

The site runs at `http://localhost:4321`.

### Editing content locally with Decap CMS

The CMS is configured for local development (`local_backend: true`). In a second
terminal, run the Decap proxy server, then open the admin panel:

```bash
npx decap-server          # terminal 2 — runs on port 8081
npm run dev               # terminal 1 — if not already running
```

Then visit `http://localhost:4321/admin/`. Changes write directly to the
`src/content/` markdown files. Image uploads land in `public/images/uploads/`.

---

## Available scripts

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server at `localhost:4321` |
| `npm run build` | Build the production site to `./dist/` |
| `npm run preview` | Preview the production build locally |

---

## Project structure

```text
chrsd-website/
├── public/
│   ├── admin/
│   │   ├── config.yml        # Decap CMS collections (mirror the Astro schemas)
│   │   └── index.html        # Decap CMS entry point (loaded via CDN)
│   ├── images/uploads/       # CMS media destination
│   └── favicon.svg
├── src/
│   ├── components/           # Header, Footer, Hero, StatsBlock, Card, etc.
│   ├── content/
│   │   ├── config.ts         # Zod content-collection schemas
│   │   ├── projects/         # "Our Work" programme entries (5 seeded)
│   │   ├── blog/             # Blog posts (3 seeded)
│   │   └── news/             # News & press items (4 seeded)
│   ├── data/
│   │   └── navigation.ts     # Site config + 5-pillar mega-menu + footer columns
│   ├── layouts/
│   │   └── BaseLayout.astro  # <head>/SEO/OG, fonts, header, footer, cookie banner
│   ├── pages/                # File-based routes (see below)
│   └── styles/
│       └── global.css        # Design tokens + base styles + utilities
├── astro.config.mjs
├── tsconfig.json             # Path aliases: @components @layouts @data @lib @styles
├── .env.example
└── package.json
```

### Routes

| Route | Page |
| --- | --- |
| `/` | Homepage (hero, about, impact stats, news) |
| `/about-us/` | About pillar landing |
| `/our-work/` | Projects listing (filterable by focus area) |
| `/our-work/<slug>/` | Project detail (Challenge → Approach → Evidence) |
| `/impact/` | Impact & Evidence pillar landing |
| `/stay-informed/` | Stay Informed pillar landing |
| `/stay-informed/blog/` | Blog listing |
| `/stay-informed/blog/<slug>/` | Blog post |
| `/stay-informed/blog/rss.xml` | RSS feed |
| `/stay-informed/news/` | News & press listing |
| `/stay-informed/news/<slug>/` | News detail (internal items only) |
| `/get-involved/` | Get Involved pillar landing |
| `/get-involved/contact-us/` | Contact form |
| `/404` | Not-found page |

---

## Content model

Three collections, defined with Zod in `src/content/config.ts` and mirrored exactly in
`public/admin/config.yml`:

- **projects** — programmes under *Our Work*. Includes the modular
  `challenge` / `approach` / `metrics` template and a `featured` flag for the homepage.
- **blog** — *Stay Informed → Blog* posts.
- **news** — homepage "Latest Updates" cards and the news/press room. Items with an
  `externalUrl` link out and do **not** generate a local detail page.

Every collection supports an `imageMeta` block (photographer, location, date, program,
consent status) per the blueprint's editorial imagery guidelines. Fill it in for
published photography.

---

## Configuration

Copy `.env.example` to `.env` and set the form endpoints when you have them:

```bash
PUBLIC_CONTACT_ENDPOINT=https://your-form-handler.example.com/contact
PUBLIC_NEWSLETTER_ENDPOINT=https://your-form-handler.example.com/subscribe
```

Both the contact form and the footer newsletter degrade gracefully: with no endpoint
set they validate client-side and show a confirmation without posting anywhere, so the
site is fully functional out of the box. Wire the endpoints to any form backend
(Formspree, a serverless function, etc.) for live submissions.

Set the canonical site URL in `astro.config.mjs` (`site:`) before deploying — it drives
the sitemap, RSS feed, and canonical/OG tags.

---

## Deployment & CMS in production

The site is a static build (`npm run build` → `./dist/`) and deploys to any static host
(Netlify, Cloudflare Pages, Vercel, GitHub Pages, S3/CloudFront).

Decap CMS is configured with the **git-gateway** backend for production, which pairs
most directly with Netlify Identity. If you deploy elsewhere, point the `backend` block
in `public/admin/config.yml` at your chosen auth provider (e.g. a GitHub/GitLab OAuth
backend). The editorial workflow (draft → review → publish) is enabled.

---

## Scope note (honest)

The five-pillar navigation defines the full information architecture from the blueprint,
including deep sub-pages within each mega-menu. The **requested deliverables — homepage,
projects collection, blog, news, contact form, responsive nav, and the five pillar
landing pages — are fully built**. Deeper mega-menu sub-links resolve to their pillar's
landing page, which lists the section's structure, rather than shipping 40+ near-empty
stub pages. Each is a clear next page to flesh out as real content is written; the
routing, components, and design system are all in place to do so quickly.

---

Reg. No. S-14480/2026 · Founded 2023 · Dhaka, Bangladesh
