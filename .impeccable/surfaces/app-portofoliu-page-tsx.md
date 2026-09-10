---
version: 1
slug: app-portofoliu-page-tsx
primary_target: app/portofoliu/page.tsx
related_targets: [components/portfolio.tsx, components/site-header.tsx, components/site-footer.tsx, components/construction-story.tsx, components/project-enquiry.tsx, app/layout.tsx, app/portfolio.css, app/navigation.css]
---

# Portfolio and persistent navigation

Mode: Persuade. Local extension of the existing gallery and cream/forest visual system, alongside the approved Three.js home story. User requests a portfolio page, always-accessible mobile menu, the large story CTA only in the first frame, and concise enquiry copy.

## Direction contract

THESIS: Let visitors browse photographic work and reach an enquiry without losing navigation.
OWN-WORLD: Inherit DESIGN.md, Switzer, cream paper, forest controls, rectangular images and fine rules. Two additional illustrative photos extend the imagery; the visual identity stays consistent.
STORY: Portfolio heading → category filters → a two-thirds/one-third photo row and three equal photos → enquiry link.
FIRST VIEWPORT: Compact heading and category description, transparent illustrative-preview disclosure, four filter buttons, one dominant landscape photograph. Same 1536px content cap as the existing continuation.
FORM: Single gallery column on mobile, two-thirds/one-third first row and three equal columns below on desktop. Native dialog enlarges photographs, has previous/next controls, arrow-key navigation, Escape dismissal and focus return. Shared fixed navbar remains outside the story's sticky/clipped viewport.
MOTION: GSAP image wipes at top 75%, staggered captions, subtle scrubbed image parallax, SplitText intro and Flip filter rearrangement. Mobile photos reveal individually. The continuous Three.js story is unchanged; only the large CTA is conditionally shown in the initial chapter. Decorative reduced-motion handling remains.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

World authority: ordinary extension of the incumbent system; no new-world seed was selected and no global token changes are authorized.

Content boundary: The old company portfolio URL returned HTTP 403 in both HTTP and browser checks. User was asked asynchronously for an accessible source of real project names/photos; no answer received during implementation. Use the three existing preview images and two newly generated images with explicit illustrative labels; do not invent names, dates, clients, locations or finished-project claims. Final delivery must disclose that real project material is still needed. No production publication is implied for this illustrative page.

Footer refinement: Shared footer on both routes follows the supplied Trellis screenshot: fine divider, compact copyright/navigation row, oversized pale lower-case tomoroga wordmark cropped at the bottom. Preserve the correct company name and cream/forest palette.

## Finish record

2026-09-10: finish reviewer returned `ship` for the local illustrative preview, with no material fixes. Documentation comparison confirmed the incumbent visual system is preserved; DESIGN.md and .impeccable/design.json remain unchanged. Evidence and pre-existing documentation drift are recorded in `.impeccable/review/portfolio/documentation.md`. Real project material remains outstanding; this verdict does not authorize publication or establish the images as company projects.
