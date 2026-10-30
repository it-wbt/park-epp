# PARK EPP: content, discovery and enquiry plan

Updated: 28 October 2026. Scope: local code and visible EPP site content review. No live ranking, traffic, Search Console, conversion or search-volume data was provided. This review cannot establish current search visibility or guarantee inclusion in AI-generated answers.

## Customer and commercial intent

The site serves product designers, automotive and HVAC engineers, packaging and logistics teams, procurement buyers, and businesses developing sports, play and living products. Buyers need to identify whether PARK can discuss their application, which information to provide, and what needs to be validated for a specific component. A product-page visit or long session alone is not evidence of a qualified lead.

The homepage introduces the material and product range. Product pages explain individual EPP product families. Industry pages describe application context. Material and expertise pages answer design and manufacturing questions. Resources support selection and project briefs. Contact forms and the completed chatbot collect requirements.

## Page ownership of topics

The topic map below reflects existing EPP catalogue and page content. It does not claim measured search volume, ranking opportunity or customer demand.

| Page | Primary customer topic | Purpose |
| --- | --- | --- |
| `/` | EPP products, moulded components and protective packaging | Introduce PARK EPP and guide product discovery |
| `/products/` | EPP product families | Search and filter the catalogue |
| `/products/[product-slug]/` | One specific EPP product family | Explain use, requirements, material and quote path |
| `/markets/logistics-handling/` | Dunnage boxes, reusable packaging and material handling | Explain payload protection, storage, transport and return loops |
| `/markets/mobility/` | Automotive EPP components | Explain fit, impact absorption, weight and vehicle interfaces |
| `/markets/hvac/` | EPP HVAC housings and air ducts | Explain airflow, insulation, assembly and servicing interfaces |
| `/markets/sports-leisure/` | Living products: toys, sports, play and drone components | Explain intended users, use conditions, fit and product validation |
| `/materials/expanded-polypropylene/` | Expanded polypropylene (EPP) material | Explain EPP selection and practical limitations |
| `/materials/epp-grade-selection/` | EPP grade selection | Help buyers prepare a grade and application brief |
| `/expertise/` and detail pages | EPP moulding, co-development and validation | Explain the process from requirement to production component |
| `/solutions/` and detail pages | Application challenges such as protection and thermal control | Connect requirements to relevant product and material pages |
| `/resources/` | EPP design and material guides | Organise practical buyer education |
| `/resources/epp-grade-selection/` | Choosing an EPP grade | Compare requirements and representative tests |
| `/resources/cold-chain-packaging-brief/` | Insulated food and cold-chain packaging briefs | Gather route, payload, temperature and test information |
| `/resources/design-for-reuse/` | Returnable packaging and reuse planning | Explain return routes, cleaning, inspection and recovery |
| `/resources/technical-part-design/` | Designing a moulded technical component | Gather drawing, interface, prototype and acceptance details |
| `/about/` | PARK company identity | Provide verified company and manufacturing context |
| `/contact/` | EPP project enquiry | Collect buyer requirements and contact details |

Avoid creating near-duplicate pages for supplier, manufacturer, price or city variations. Add a page only when it represents a distinct product, application or buying decision and has useful information of its own. Keep the Living page's human-facing name if desired, but include clear toys, sports, play and drone context in its title, description and visible introduction so buyers understand the category.

## Implemented in the EPP site

- Homepage metadata and distinct page titles/descriptions for catalogue, industry, product, material, expertise, resource and contact pages.
- Canonical URLs on the homepage, section pages and detail pages, based on the configured site origin.
- Organization structured data site-wide; BreadcrumbList on detail pages. Quote-only product pages intentionally omit Product rich-result markup because they do not publish prices, offers or customer ratings.
- A generated sitemap covering active products, the four public industries, materials, expertise, solutions, resources and about pages; robots metadata points to that sitemap.
- Visible industry and product navigation, catalogue filters, internal product-to-industry links and clear contact paths.
- Buyer-oriented EPP material guidance, practical requirements lists, FAQs, application-specific design prompts and caution against unsupported performance claims.
- Homepage, contact, product quote and completed chatbot enquiries use the shared enquiry flow. Enquiries are saved to the configured Google Sheet; the email is attempted through FormSubmit. Chat messages are logged to the Sheet's Chat Logs tab.
- Mobile-friendly page layouts and readable product content; product visuals have descriptive alternative text, including PARK-branded product render descriptions.

## Findings and work still pending

1. **Set the production canonical origin in Vercel.** Live `www.parknonwoven-epp.com` returns 200, and the apex redirects to `www`. However, the sampled live page canonicals plus `robots.txt` and `sitemap.xml` still use `park-epp.vercel.app`. The source fallback has now been changed to `https://www.parknonwoven-epp.com`; also set `NEXT_PUBLIC_SITE_URL=https://www.parknonwoven-epp.com` for the Vercel Production environment, because an environment value overrides the fallback, then redeploy.
2. **Recheck production output after redeploy.** Confirm HTTPS and apex-to-www redirects; inspect canonical tags, page titles and descriptions, `robots.txt`, `sitemap.xml`, internal links and JSON-LD in real HTTP responses. Confirm the sitemap contains the chosen production host, not a Vercel hostname.
3. **Review topic coverage.** The Living market title and introduction have now been updated to include toys, sports, play and drone applications while retaining the selected Living name. Keep individual product titles unique and descriptive; check other market and product content against the actual products and approved claims.
4. **Set up Google Search Console.** Verify the production domain property, submit the production sitemap and inspect a sample of homepage, industry, product and guide URLs. No Search Console or indexing data was supplied for this review.
5. **Confirm enquiry delivery in production.** The EPP form now treats a successful Sheet save as success even when FormSubmit does not confirm the email. Before relying on the flow, verify that enquiries reach both the Enquiries tab and the sales inbox, and that chatbot messages reach Chat Logs. The visitor confirmation alone does not prove email delivery.
6. **Verify public business claims.** Check company, plant, production, capacity, product, safety, environmental and performance claims against approved PARK evidence. Do not publish certifications, test results, numerical claims, customer names, prices or ratings without the supporting source.
7. **No live performance score is available.** Search visibility, indexation, page speed and conversion performance need production data and appropriate tools; source-code inspection alone cannot establish these results.

## AEO: useful, attributable answers

For answer engines and AI-assisted search, the useful work is the same as for good SEO: provide crawlable pages, clear page ownership, readable on-page answers, useful internal links and evidence for technical claims. The EPP site already has several question-led material, product and industry explanations. Improve them by putting the direct answer near the relevant heading, then explain the conditions, limitations and information needed to validate the application. Attribute external technical guidance and distinguish general material facts from PARK-specific capabilities.

Do not add FAQ or other structured data solely to seek AI placement. Keep structured data consistent with visible page content. Google says there are no special AI Overview requirements or AI-specific schema; eligibility still depends on normal Search indexing and snippet requirements. Google also advises against scaled, unreviewed AI-generated pages. Prioritise original application knowledge and human verification over page count or repetitive keyword variants.

## Measure useful outcomes

After launch, use a consistent Search Console query/page/country/device scope to review indexation, relevant impressions, organic clicks, CTR and position. Keep dated snapshots and compare equivalent periods. Separately track product discovery and qualified enquiries using an approved analytics setup. Treat submitted enquiries and confirmed inbox/Sheet delivery as outcomes; do not use dwell time or raw chatbot opens as stand-ins for qualified leads. No ranking, conversion or first-position result is guaranteed by metadata, schema or content volume.

## Guidance

- [Google Search Central SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Search Central guidance on AI features](https://developers.google.com/search/docs/appearance/ai-features)
- [Google Search Central guide to generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google Search Central: build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

