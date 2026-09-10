---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["components/construction-story.tsx", "app/story.css", "app/scene.tsx", "lib/house-model.ts", "lib/construction-story.ts", "components/home-sections.tsx", "app/sections.css"]
---

# Home page: construction story and continuation

Mode: Persuade. The opening is an immersive construction demonstration leading to a project enquiry. Preserve Romanian company content and service/contact paths. The house and generated photographs are illustrative; the process is proposed. Local preview is the requested deliverable.

## Direction and evidence

The user approved a full-screen, real Three.js house story with the existing cream/green duotone shader and left-side copy. The user subsequently said “love it” and requested more detailed assembly: slab pieces, staggered falling walls, stairs appearing step by step, windows and staggered roof layers. The earlier model's gaps and floating platform were identified for correction; the current model code includes connected wall regions, a grounded terrace and exterior treads, an interior staircase and a stairwell opening. This records implementation, not an independent engineering or visual certification.

Direction source: `.impeccable/build/house-story/direction.md`.

The prior continuation brief records `.impeccable/mocks/approved-sections.png` as its approved composition reference. That applies to the gallery/process/details/enquiry continuation only. Story comp generation was interrupted and returned no files; no approved raster comp or story fidelity-gate pass is claimed. This documentation pass read current source and did not run a browser review.

## Direction contract

THESIS: Show a finished house, uncover what supports it, then let the visitor follow its construction back to a whole home before exploring company capabilities and making contact.

OWN-WORLD: Preserve cream paper, forest-green ink, Switzer and the supplied logo. Real Three.js geometry retains the original duotone illumination mapping and grain. Photographic continuation panels remain rectangular, with fine rules and compact controls.

STORY: Viziune → Straturi → Fundație → Parter → Etaj → Acoperiș → Acasă. Start with the complete house. Separate major layers, move close to the foundation and service pipes, rebuild each floor and roof, then return to the finished house. The two-step enquiry follows immediately; the gallery, process and details are commented out.

FIRST VIEWPORT: Small header above a full-viewport cream scene; readable text and project CTA on the left, complete house on the right, discreet chapter controls below. The scene is full-bleed. Text and the page continuation retain a centered 1536px cap. Desktop text is approximately 36% wide, with a maximum measure of 490px. A transparent-to-opaque scene mask protects the copy's reading field.

FORM: One sticky viewport owns the opening. Desktop story length is 740svh; mobile is 620svh. At 700px and below, copy stacks above the house and the scene mask fades away from copy and chapter controls. The story has a minimum sticky height of 600px desktop; mobile follows the small viewport height without a minimum. Chapter controls remain available on desktop and are hidden on mobile, where native scrolling drives the journey. Opaque cream behind chapter controls and the illustrative label preserves legibility; story focus outlines use forest green.

MOTION: One GSAP timeline coordinates geometry, camera and framing. Native scrolling scrubs reversibly with 0.45-second smoothing on desktop and 0.2-second smoothing on mobile. The scroll range uses the stable sticky height, and overflow clipping does not create a nested scroll container. Holds alternate with construction moves. Chapter controls jump to stable positions: 0, .21, .402, .552, .702, .875 and .99. Slabs settle as separate pieces; wall pieces fall in sequence while retaining their dimensions; stair parts build individually; windows reveal together with their frames; roof deck, timber trusses, roof bays and trim follow staggered schedules. Finished-house context returns at the close.

The first heading has a 250ms lead-in and a 200ms character entrance with 100ms total stagger. Supporting copy and links begin after 350ms on initial load. Once the first rendered scene frame is ready, the scene wipes in over 200ms after a 450ms delay. Bottom controls enter after 550ms with 35ms stagger. Later chapter copy uses a brief entrance; avoid duplicating an independent hero motion system.

The user explicitly rejected static chapter snapshots: the 3D construction timeline now interpolates continuously regardless of OS motion preference. Decorative text entrances continue honoring reduced motion. WebGL failure provides readable copy and a link to the enquiry, with unavailable chapter controls disabled. Touch scrolling retains the browser's native vertical gesture.

CONTINUATION: The user requested that the gallery, process and detail sections be commented out. Preserve them in `components/archived-home-sections.tsx`. A two-step enquiry follows the story: project type/locality with optional brief details, then name and a preferred phone/email contact. Keep the cream/forest palette, strong left-side heading, fine divider and visible primary action. On mobile the columns stack and inputs use 16px text. Validate inline, preserve values through back/edit/retry, disable duplicate submissions and show success only after the server confirms provider acceptance. Direct submission replaces the email-draft handoff; Resend credentials and a verified sender remain required for live delivery. The form/footer remain excluded from scroll entrance animations.

FINISH: Root `DESIGN.md` and `.impeccable/design.json` now record the extracted system. The implementation owner reports successful production build, TypeScript and targeted lint checks for this version. Story screenshots, finish-review verdict and any fidelity-gate outcome must be recorded by the responsible reviewer with their actual evidence; this source-only documentation handoff does not establish them. Keep provenance for shipping generated photography and retain illustrative disclosures.

## Pipe and assembly refinement

Pipes begin hidden and lay from progress .305 to .400, before floor assembly. Nine routed networks with 59 laying units use swept bends, branches, risers, supply manifold, cleanout and grounded supports through footing openings. All assembly units fade quickly during their first 42% of placement progress with independently cloned materials preserving the duotone shader. Each chapter now has the project CTA. Landscape contains trees only, translated upward 32 world units during the layer reveal and returned during completion; the approach paving slab and stock box are removed. Mobile exploded-view camera shifts down to leave the longer caption and CTA clear.
