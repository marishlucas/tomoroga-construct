# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Prospective construction clients evaluating Tomoroga Construct for a project.

## Product Purpose

A Romanian company presentation website whose primary goal is to get prospective clients to contact Tomoroga Construct about a construction project. Confirmed by the user during initialization.

## Capabilities and Constraints

- The existing page presents services, company information, and email and phone contact links.
- The interactive construction illustration progresses from Fundație through Structură and Arhitectură to Clădire. It should start at Fundație and assemble forward.
- Visitors can select construction stages using the controls aligned to the right below the illustration; scrolling assembles the scene on desktop and mobile. Mobile uses a shorter scroll sequence so assembly completes while the model is visible. Respect the visitor's reduced-motion preference.
- Preserve Romanian terminology and the existing company identity during page refinements.
- The approved home-page continuation includes a construction-type gallery, proposed client process, interactive construction-detail hotspots, and a two-question enquiry that prepares an email draft.
- Generated imagery is authorized for this preview and must be identified as illustrative; do not present it as photographs of Tomoroga's actual employees or completed projects.
- User requested GSAP motion: a continuous draggable gallery, a process marker that continues from its current position, and stable detail panels. Keep the process photograph stationary. Preserve touch, keyboard, and reduced-motion support.
- Keep the complete page centered within a 1536px maximum width.
- Apply new entrances only to the gallery, process, and detail sections. Exclude the entire enquiry/footer. The hero heading starts after a 500ms page-load pause, followed by its paragraph and buttons; the scene gets a 200ms wipe with a 700ms lead-in once its first rendered frame is ready on page load, independently of scrolling. Its caption and four phase controls stagger in after an 800ms lead-in with 35ms between items. Preserve its existing 3D assembly animation.
- Scroll entrances wait until each target crosses 75% of the viewport. Headings use 200ms character animations with 100ms total stagger; images wipe across their stationary frames, button groups rise with a tight stagger, and rules draw from their starting edge. Entrances play once and honor reduced motion.

## Brand Commitments

Tomoroga Construct. Use the existing supplied company logo at `public/tomoroga-logo.png`.

## Evidence on Hand

The existing page describes civil and industrial construction, rehabilitation, and infrastructure, and states that the company has operated since 2004. These are existing site claims, not independently verified facts. Preserve their meaning; do not add unsupported claims.

The 3D scene is an illustrative construction study, not evidence of a completed company project. No verified project case studies or testimonials have been established in this initialization.

## Product Principles

- Help prospective clients understand the company's services and make contact.
- Make the construction sequence understandable from its first stage.
- Preserve company content and assets; substantiate any new factual claims.

## Open Decisions

Priority client segments, service geography, and verified completed-project material remain unspecified.
