# GSC Coverage analysis — 2026-09-24

Analysis of the Google Search Console **Page Indexing (Coverage)** export for
`https://marketorix.com/`, cross-checked against the deployed site.

| | |
|---|---|
| Source | `~/Downloads/https___marketorix.com_-Coverage-2026-09-24/` (Chart.csv, Critical issues.csv, Metadata.csv, Non-critical issues.csv) |
| Property | URL-prefix `https://marketorix.com/` |
| Sitemap filter | All known pages |
| Data window | 2026-06-26 → 2026-09-21 (chart lags ~3 days behind the 09-24 export) |
| Method | CSV parsing + live crawl of all 125 sitemap URLs, all 104 blog URLs' language/duplication, CMS API comparison, local-build reproduction |
| Analysed | 2026-09-24 |

---

## 1. Headline

**149 not indexed / 23 indexed → 172 known URLs. 13.4 % indexed.**

| Reason | Source | Validation | Pages |
|---|---|---|---|
| Crawled – currently not indexed | Google systems | Started | **67** |
| Discovered – currently not indexed | Google systems | Not Started | **52** |
| Alternate page with proper canonical tag | Website | Started | 25 |
| Duplicate without user-selected canonical | Website | Started | 3 |
| Duplicate, Google chose different canonical than user | Google systems | Not Started | 2 |

Impressions, the only performance signal in this export: **2,639 over 87 days =
30.0/day, range 11–57.**

| Month | imp/day | end-of-month not-indexed / indexed | indexed % |
|---|---|---|---|
| 2026-06 (from 06-26) | 21.4 | 104 / 17 | 14.0 % |
| 2026-07 | 25.5 | 107 / 22 | 17.1 % |
| 2026-08 | 37.6 | 105 / 23 | 18.0 % |
| 2026-09 (to 09-21) | 27.3 | 149 / 23 | 13.4 % |

Three months of flat near-zero visibility. Indexed count moved 17 → 23 while
known URLs grew 121 → 172. This is a plateau, not a trend.

## 2. What this export can and cannot show

The window ends before both SEO deploys, so it measures the **broken** state:

| Deploy | Commit | Time |
|---|---|---|
| Canonical fix (www → apex) | `7b66643 canonical` | 2026-09-20 16:53 CEST |
| Cluster content (10 fix pages + hub) | `16f5678 contentA` | 2026-09-21 15:22 CEST |
| Running container build | — | `2026-09-21T15:04:24Z` (read from `lastmod` on the 21 static sitemap entries) |

Both are pushed to `origin/main`. The first post-fix read is the next export
(~09-25 onward); meaningful movement takes 2–6 weeks.

Two events in the series are **not** explained by our deploys:

- **09-05:** indexed 23 → 16 with no deploy since 07-14. Google re-evaluating on
  its own; most plausibly the www-canonical pages being re-crawled while their
  canonical target 404s. Attribution is not provable from these files.
- **09-19:** known URLs 113 → 172 in one day (+59); not-indexed +51, indexed +8.
  The +51 lands in `Discovered – currently not indexed`: Google learned ~52 new
  URLs and **did not crawl one of them**. That is a crawl-priority statement,
  not a penalty.

Expect the same from the 11 cluster URLs deployed 09-21: they arrive as new
"Discovered – not indexed" URLs and push the total up. Not a regression.

**Caveats.** No clicks, queries, CTR or positions (that is the Performance
export). No URL lists per reason, so the 25/3/2 cannot be attributed from these
files. The property is URL-prefix apex-only, so the whole pre-09-20 www-canonical
problem lives in the separate www property and is **invisible here**.

## 3. Reason by reason

**Crawled – currently not indexed (67)** — Google fetched these and declined to
index them. 45 % of the not-indexed set. This is a quality/demand/duplication
verdict; canonical or hreflang changes will not move it. See §4.

**Discovered – currently not indexed (52)** — known, never crawled. Crawl-budget
starvation on a site with only 23 indexed pages.

**Alternate page with proper canonical tag (25)** — *not a bug.* This bucket is
the system working: these URLs correctly declare another URL as canonical. Do
not chase it, and note that validating it is a no-op. Given §4, it is best read
as a symptom of Google consolidating duplicate locale twins.

**Duplicate without user-selected canonical (3)** / **Duplicate, Google chose
different canonical than user (2)** — small, but the only two rows where the
canonical signal is either absent or overridden. Need the URL lists to fix.
Prime suspect for the second: the soft-404 farm in §5.1.

## 4. Root cause: the Dutch site is English

Verified by crawling all 104 blog URLs.

- **All 52 en/nl pairs are byte-identical.** Every `<p>` matched — exhaustively
  52/52 pairs, plus sampled paragraph counts (53/53, 46/46, 63/63) and identical
  character counts.
- **51 of 52 `/nl/blog/` posts are English**, measured on visible text (0 Dutch
  function words). The 52nd is genuinely Dutch, and its `/en/` twin is Dutch too
  — served under `<html lang="en">`.
- **The CMS is the source, not the renderer, and the API is locale-blind.**
  For `ai-for-financial-fraud-detection-a-proactive-approach` the `en` and `nl`
  responses are byte-identical (17,667 bytes each, same entry id, same title,
  `metaTitle`, `metaDescription`, 10,999 characters of identical body text).
  The same holds for the whole collection: `?locale=en` and `?locale=nl` each
  return 48,488 bytes with the **same 52 ids, the same slugs, and 52/52 identical
  titles**.

  The decisive probe: **`?locale=fr` also returns all 52 documents.** A locale
  value that is not configured cannot legitimately select every document, so the
  `locale` parameter is being ignored outright — `filters[locale][$eq]=nl` is
  rejected as `Invalid parameter locale`, and no response carries a `locale`
  attribute or a `localizations` relation. Whichever way the CMS is configured
  (i18n not enabled on `posts`, or no Dutch rows existing), **the API hands back
  the default-locale documents for every locale requested**, so no Dutch article
  text reaches the app at all.

  This is not a translation-quality problem, it is an empty-localization
  problem: the UI chrome *is* translated (`messages/nl.json`, 201 keys, e.g.
  `Navigation.services = Diensten`), which is why the pages look Dutch, while
  every article body underneath is the English one.

  The app cannot currently detect this, because `getAllPostsForSitemap()`
  queries each locale and records a slug as available wherever the query returns
  a document. A locale-blind API therefore marks **all 52 posts as available in
  `nl`**, which is where the 52 phantom Dutch URLs, their `nl` hreflang entries,
  and half the coverage report come from.

  Acceptance test once the CMS is localised: `?locale=fr` must return **0**
  documents and `?locale=nl` must return only genuinely translated ones.

So the site has **52 unique articles occupying 104 URLs**, plus identical titles,
descriptions and H1s across every pair (all 5 static page pairs too: "Services |
Marketorix" ×2, "Team" ×2, "Contact" ×2, "Latest Blog Posts" ×2, home ×2).
Localising the chrome did not create a Dutch site; it created 51 English
duplicates behind Dutch URLs.

This is the mechanism behind `Crawled – currently not indexed` (67), the
duplicate rows, and the 13 % index rate. No canonical or hreflang change will
move a quality verdict.

> Note: an earlier read of "content is not thin — 52 posts per locale" counted
> URLs, not unique articles. Same data, wrong inference.

## 5. Additional defects found and verified

### 5.1 Soft-404 farm with self-canonicals (fixed in this pass)

`https://marketorix.com/foo.bar` returned **HTTP 200 with the home page**,
`<html lang="foo.bar">` and
`<link rel="canonical" href="https://marketorix.com/foo.bar">`. Also confirmed
on `/foo.png`, `/foo.js`, `/nonexistent.xml`, `/anything.html`, `/sitemap.txt`,
`/robots.txt.bak`, `/x.y`, `/logo.png`, `/manifest.webmanifest`, and
`/logo.png/blog` (which reached the blog route).

Cause: the middleware matcher deliberately exempts any path containing a dot
(`'/((?!api|_next|_vercel|.*\\..*).*)'`) so that assets are never
locale-prefixed, and nothing validated the `[locale]` segment. A dotted junk
path therefore fell through to `[locale]` with the whole junk segment as the
"locale". That is an unbounded set of self-canonical home-page duplicates on a
site whose binding problem *is* crawl budget — and the exact signature of
"Duplicate, Google chose different canonical than user".

Dotted paths were the only ones affected: every non-dotted unknown path was
already locale-normalised by the middleware and 404'd (`/pricing` → 307 →
`/en/pricing` → 404). Real files were never involved: Next serves `public/`
before routing.

### 5.2 Conflicting `x-default` in the HTTP `Link` header (fixed in this pass)

Every page carried two different `x-default` declarations for the same URL:

```
HTTP  link: ... <https://marketorix.com/services>; rel="alternate"; hreflang="x-default"
HTML  <link rel="alternate" hrefLang="x-default" href="https://marketorix.com/en/services"/>
```

Conflicting annotation sets are discarded wholesale by Google — the last thing a
site with 52 locale twins can afford.

The header is emitted by **next-intl's own middleware**, not by the reverse
proxy. (An earlier note in this project blamed Traefik; that was wrong.)
Reproduced on a local build with no proxy in the path, and traced to
`next-intl/dist/esm/production/middleware/getAlternateLinksHeaderValue.js`,
which builds the x-default entry from the locale-stripped internal pathname and
never re-applies the locale prefix that the per-locale entries receive.

### 5.3 The new cluster is an orphan island

Crawling anchors across all 125 sitemap URLs: **zero** pages outside the cluster
link to `/en/case-studies` or any `/en/fix/*`. Inbound links to fix pages exist
only from inside the cluster (1–3 each).

Eleven sitemap-only orphans, on a site where 52 URLs are already too
low-priority to crawl, will sit in `Discovered – currently not indexed`
indefinitely.

### 5.4 Content hygiene

- Title `0 AI Tools Small Businesses Actually Need in 2025` — the slug says
  `10-ai-tools`, so the leading "1" is missing. Both locales. Stale year.
- Title `What Is an AI API? Complete Guide to AI Integration (2025))` — stray `)`.
- `how-can-small-businesses-use-ai` renders **2 `<h1>`s** in both locales.
- A Dutch article sits in the English tree:
  `/en/blog/waarom-een-ai-agent-inhuren-is-als-een-ceo-aanstellen-zonder-team`.
- `https://www.marketorix.com/en/blog` still returns **404** (re-verified
  2026-09-24) — the reverse proxy routes apex only, so every inbound www link
  (including all pre-09-20 canonical and `og:image` targets) is dead.

## 6. Changes made in this pass

| File | Change |
|---|---|
| `src/middleware.ts` | `alternateLinks: false` on `createMiddleware`, with the reasoning inline |
| `src/app/[locale]/layout.tsx` | `if (!isLocale(locale)) notFound()` in both `generateMetadata` and the layout |
| `src/lib/api.ts` | `declaredLocales()` availability rule; `getAllPostsForSitemap()` no longer trusts the `locale` it requested; new `getPostLocales(slug)` |
| `src/lib/site.ts` | New `alternatesForLocales(locale, path, published)` |
| `src/app/[locale]/blog/[slug]/page.tsx` | hreflang built from published locales instead of `alternatesFor` |

The guard lives in the layout rather than the home page because `[locale]` is
the parent segment of every route — `/foo.png/blog` reached the blog route the
same way. Switching the header off (rather than patching its string output) also
keeps the fix independent of the upstream next-intl bug.

### The locale availability guard

`getAllPostsForSitemap()` used to treat a post as available in `nl` whenever the
`nl` query returned a document — which a locale-blind API always does. It now
takes availability only from what a response *declares*:

| Response declares | Availability taken as |
|---|---|
| `locale: "nl"` | `nl` (one locale — the document's own) |
| nothing (today's CMS) | the source locale only, i.e. `en` |

So today no Dutch URL is advertised anywhere, and the moment the CMS is
localised the responses begin declaring their locale, real translations reappear
in the sitemap and the hreflang sets, and no second code change is needed.

The availability fetch deliberately sends **no `fields` restriction**: a field
list can hide the `locale` system attribute the rule depends on, which would pin
the site to one language forever and do so silently.

Dutch URLs keep working for visitors (a Dutch reader following an internal link
must not hit a dead end); they are simply not published as translations. The
article page's canonical therefore stays on the requested locale, and its
hreflang set is only emitted when two or more locales are genuinely published —
a set of one has nothing to annotate.

### Verified on a local build (`npx next build` → `next start -p 3100`)

- Build exits 0; lint and type checks pass; routes unchanged.
- **Junk dotted paths now 404** with no canonical and no page content:
  `/foo.png`, `/logo.png`, `/x.y`, `/sitemap.txt`, `/anything.html`,
  `/manifest.webmanifest`, `/foo.js`, `/logo.png/blog`.
- **Real assets and routes unaffected:** `/logo.svg` (image/svg+xml),
  `/favicon.ico`, `/Face.jpeg`, `/robots.txt` (text/plain), `/sitemap.xml`
  (application/xml), `/en`, `/nl`, `/en/services`, `/en/blog`,
  `/en/blog/<slug>`, `/nl/blog/<slug>`, `/en/fix/<slug>`, `/en/case-studies` —
  all 200.
- **Sitemap is 73 URLs, down from 125:** 52 `en` posts + 10 static + 11 cluster,
  with **zero `/nl/blog/` entries**. The 5 Dutch static pages remain, since those
  are genuinely localised pages rather than fallback renders.
- **Blog hreflang:** `/en/blog/<slug>` and `/nl/blog/<slug>` emit no hreflang at
  all while the article exists in English only; the sitemap carries `en` +
  `x-default` for those posts only.
- **HTML hreflang on static pages intact** — `en`, `nl`, `x-default` →
  `/en/services`.
- **Font-preload `Link` header still present** (it is a separate header, so
  disabling the alternates header does not affect it).
- Redirects unchanged: `/` → **301** `Vary: Cookie` → `/en`; `/robert` → 308;
  `/fr`, `/fr/services` → 307 → 404; `/en/xyzzy` → 404; `/nl/fix/<slug>` → 404
  (locale guard on en-only content); `/en/fix/<unknown>` → 404.

### Verified against a locale-honouring stub CMS

The self-correcting half cannot be observed against the current CMS, so it was
tested against a minimal Strapi-shaped stub that honours `locale` (5 posts in
`en`, 3 of them also in `nl`, `fr` → 0 documents), built with
`NEXT_PUBLIC_STRAPI_API_URL` pointed at the stub:

- Sitemap publishes exactly the 3 genuinely translated posts at
  `/nl/blog/...`; the 2 untranslated posts stay English-only.
- A translated post's `en` and `nl` pages both emit
  `en` + `nl` + `x-default`, each with its own self-canonical.
- An untranslated post's `en` page emits a canonical and no hreflang.

Then rebuilt against the real CMS to confirm the shipped configuration.

Not committed or pushed. CI deploys on push to `main`.

## 7. Open items

Ordered by leverage.

1. **Make the Dutch half real — this is the intended product, not a mistake.**
   An English site plus a Dutch site for a Dutch audience is the right
   architecture and the code already implements it (`getPost(slug, locale)`,
   per-locale sitemap availability, `messages/nl.json`, hreflang pairs). What is
   missing is Dutch *content*: enable localisation on the `posts` content type in
   Strapi and create the `nl` entries (§4).

   Until those entries exist, the phantom set is no longer advertised: the
   availability guard in `src/lib/api.ts` (§6) keeps the 52 Dutch URLs out of the
   sitemap and out of every hreflang set, and puts them back automatically once
   the CMS returns genuinely localised documents. The URLs themselves keep
   working for visitors.

   Remaining follow-up, not done: the `/nl/blog` listing still links to those
   articles. Hiding them there would be more consistent with the guard but leaves
   a Dutch blog index with nothing on it, so it is a product call rather than a
   technical one.
2. **Add contextual internal links into the cluster** from the home page,
   `/services`, and the blog posts the fix pages already cite (§5.3).
3. **Check the validation start dates** in GSC for the two Website reasons. If
   they were requested before 2026-09-20 they tested the broken build; re-request
   now.
4. **Fix www routing** at the reverse proxy (still 404 on every path).
5. **Pull the missing data:** Performance export (clicks/queries/positions), the
   per-reason URL lists from the GSC drill-down, and any www/Domain property —
   the www property holds the entire pre-09-20 canonical story.
6. **Content hygiene** (§5.4): two broken titles, the double `<h1>`, the
   misplaced Dutch post.
7. **Resubmit `sitemap.xml`** (it changed on 09-21: 125 URLs including 11 new).
8. **Judge this by clicks and queries, not coverage.** 2,639 impressions in 87
   days with 23 indexed pages means demand and authority are the binding
   constraints; indexing fixes are necessary but will not produce traffic alone.

## 8. Reproducing

```bash
# live inventory
curl -s https://marketorix.com/sitemap.xml | grep -o '<loc>[^<]*</loc>' | sed 's|<loc>||;s|</loc>||' > /tmp/urls.txt

# soft-404 farm (before the fix): 200 + self-canonical
curl -s -o /tmp/x.html -w '%{http_code}\n' https://marketorix.com/foo.png
grep -o 'rel="canonical" href="[^"]*' /tmp/x.html

# locale twins: identical body text
#   compare <p> sets of /en/blog/<slug> and /nl/blog/<slug>

# CMS is the source of the duplication, and the locale parameter is ignored
curl -s "https://strapi.marketorix.com/api/posts?locale=en&pagination%5BpageSize%5D=100" | wc -c   # 48488
curl -s "https://strapi.marketorix.com/api/posts?locale=nl&pagination%5BpageSize%5D=100" | wc -c   # 48488 (same bytes)
curl -s "https://strapi.marketorix.com/api/posts?locale=fr&pagination%5BpageSize%5D=100" | grep -o '"id"' | wc -l   # 52 -> param ignored
```

Local verification of §6:

```bash
npx next build && npx next start -p 3100
curl -sI http://127.0.0.1:3100/en/services | grep -i '^link'   # no alternates header
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3100/foo.png   # 404
```
