# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Prospective construction clients evaluating Tomoroga Construct for a project.

## Product Purpose

A Romanian company presentation website whose primary goal is to get prospective clients to contact Tomoroga Construct about a construction project. Confirmed by the user during initialization.

## Capabilities and Constraints

- The existing page presents services, company information, and email and phone contact links. Preserve Romanian terminology and the supplied company identity.
- The approved opening is a full-screen, real Three.js construction story. Preserve the existing cream/green duotone ink shader and animate model geometry; the house is illustrative, not a verified company project.
- The story starts with the complete house and follows seven chapters: Viziune, Straturi, Fundație, Parter, Etaj, Acoperiș, Acasă. Separate the layers, inspect foundation and service pipes, then rebuild the ground floor, upper floor and roof before returning to the finished home.
- Assembly reveals slab pieces first, then staggered falling walls, a staircase built step by step, windows, and staggered roof deck, trusses and panels. Preserve a grounded terrace and exterior steps, connected walls and a real opening above the interior stair.
- Native page scrolling drives a reversible GSAP sequence. Chapter controls jump to stable reading positions. Mobile uses a shorter sequence with readable copy above the scene. Respect reduced motion with static chapter selection; retain a useful WebGL fallback.
- The Three.js scene is full-bleed. Story text and the continuation below retain a centered 1536px content cap. The former whole-page cap and foundation-first four-stage hero are superseded.
- The story now leads directly to a two-step project enquiry. The gallery, process and construction-detail sections are commented out and their implementations retained for restoration. The user explicitly chose direct website submission to office@tomorogaconstruct.ro. Type and locality are required first; project stage, timing, description, area and budget are optional. Contact requires a name and one preferred method, phone or email. Delivery uses a server-side Resend endpoint and needs configured credentials plus a verified sender before launch. Do not claim an enquiry was sent without provider confirmation.
- Generated imagery is authorized for this preview and must be identified as illustrative; do not present it as photographs of Tomoroga's actual employees or completed projects.
- User requested GSAP motion: a continuous draggable gallery, a process marker that continues from its current position, and stable detail panels. Keep the process photograph stationary. Preserve touch, keyboard, and reduced-motion support.
- Apply continuation entrances only to the gallery, process, and detail sections. Exclude the entire enquiry/footer. Preserve the story's initial copy lead-in and scene reveal after the first rendered frame; exact timing and responsive composition live in the surface brief.
- On reload, start at the top and clear the current section hash; normal in-page anchor navigation still works. Hero copy is concealed before the first paint until its delayed entrance is initialized.
- Continuation entrances wait until each target crosses 75% of the viewport. Headings use 200ms character animations with 100ms total stagger; images wipe across stationary frames, button groups rise with a tight stagger, and rules draw from their starting edge. Entrances play once and honor reduced motion.

- Foundation pipes are hidden in the initial finished-house view and remain hidden until their laying sequence. Every story chapter includes a project CTA. Trees move upward out of view and descend again with the scroll timeline. The small approach paving slab and material box near the tree are removed. All 299 assembly units use independent quick opacity fades alongside their staggered movement. The foundation chapter lays nine connected service routes in staggered sections before the floor slabs arrive: swept elbows, offset drain branches, risers, paired supply runs, coupling collars, a valve manifold and cleanout. Pipes pass through visible footing openings and raised runs have ground supports. The sequence reverses with scroll and preserves static reduced-motion chapter selection.

## Brand Commitments

Tomoroga Construct. Use the existing supplied company logo at `public/tomoroga-logo.png`.

## Evidence on Hand

The existing page describes civil and industrial construction, rehabilitation, and infrastructure, and states that the company has operated since 2004. These are existing site claims, not independently verified facts. Preserve their meaning; do not add unsupported claims.

The 3D scene is an illustrative construction study, not evidence of a completed company project. No verified project case studies or testimonials have been established in this initialization.

## Product Principles

- Help prospective clients understand the company's services and make contact.
- Make the construction sequence understandable, connecting the finished result to its underlying stages.
- Preserve company content and assets; substantiate any new factual claims.

## Open Decisions

Priority client segments, service geography, and verified completed-project material remain unspecified.
