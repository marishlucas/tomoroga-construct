---
name: Tomoroga Construct
description: Cream paper, forest-green ink and construction made visible.
colors:
  paper: "#f5f3ec"
  ink: "#243529"
  green: "#28593d"
  section-ink: "#132c22"
  section-green: "#214f39"
  section-line: "#7c9583"
  copy-muted: "#4d5e50"
  selected-paper: "#e0e6d5"
  hover-paper: "#e5e8dc"
typography:
  display:
    fontFamily: "Switzer, Arial, sans-serif"
    fontSize: "clamp(48px, 5.2vw, 80px)"
    fontWeight: 500
    lineHeight: 1.03
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Switzer, Arial, sans-serif"
    fontSize: "clamp(2.7rem, 5.9vw, 5.5rem)"
    fontWeight: 500
    lineHeight: 1.01
    letterSpacing: "-.04em"
  title:
    fontFamily: "Switzer, Arial, sans-serif"
    fontSize: "clamp(1.7rem, 3.3vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-.035em"
  body:
    fontFamily: "Switzer, Arial, sans-serif"
    fontSize: "clamp(14px, 1.15vw, 17px)"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Switzer, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
rounded:
  control: "2px"
  round: "50%"
spacing:
  gutter: "clamp(24px, 4vw, 68px)"
  control-gap: "10px"
  option-gap: "12px"
  gallery-gap: "24px"
  panel-gap: "28px"
components:
  button-story:
    backgroundColor: "{colors.green}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "13px 20px"
  button-forward:
    backgroundColor: "{colors.section-green}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    size: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.section-green}"
    rounded: "{rounded.control}"
    size: "48px"
  choice-selected:
    backgroundColor: "{colors.section-green}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "12px 6px"
  chapter-selected:
    backgroundColor: "{colors.selected-paper}"
    textColor: "{colors.section-green}"
    padding: "10px 12px"
  hotspot-selected:
    backgroundColor: "{colors.section-green}"
    textColor: "{colors.paper}"
    rounded: "{rounded.round}"
    size: "48px"
---

# Design System: Tomoroga Construct

## Overview

**Creative North Star: "Construction in Ink"**

Cream paper and forest-green ink connect the supplied company mark, restrained typography and illustrative construction imagery. The character is precise and spacious: large readable statements, fine rules, rectangular image fields and compact controls.

The visual signature is a real duotone architectural model. Its light, grain and cast shadows describe physical construction; interface surfaces remain predominantly flat. This is a scan of the approved cream/green direction and current implementation. The North Star names that existing direction; it is descriptive documentation, not a separate user-selected concept.

**Key Characteristics:**

- Cream paper and forest-green ink.
- Switzer typography with large, tightly tracked headings.
- Rectangular image fields, fine rules and restrained controls.
- Motion explains construction and selection while preserving reading space.

## Colors

The primary palette pairs warm paper with green ink; the continuation uses a deeper green for broad fields and selected controls.

### Primary

- **Construction Green** (`green`): story accents and the main story action.
- **Forest Field** (`section-green`): process background, forward buttons, selected choices and detail markers.

### Neutral

- **Cream Paper** (`paper`): page and scene background, reversed text on green.
- **Green Ink** (`ink`): opening text and navigation.
- **Deep Ink** (`section-ink`): continuation headings and controls.
- **Sage Rule** (`section-line`): outlined controls and field borders.
- **Muted Green Copy** (`copy-muted`): supporting story text.
- **Selected Paper** (`selected-paper`) and **Hover Paper** (`hover-paper`): quiet selection and hover surfaces.

**The Ink Continuity Rule.** Preserve the existing cream/green shader, including its grain and light-to-shadow mapping, when extending the architectural illustration. Material-specific pairs remain defined in `lib/house-model.ts`; they are not interchangeable UI accents.

## Typography

Switzer is locally supplied in regular, medium and semibold weights, with Arial and sans-serif fallbacks. Use medium weight for major headings and regular weight for supporting copy. Tight negative tracking belongs to headings; small labels remain plain and readable.

The frontmatter records the implemented desktop display, section headline, title, story body and label roles. Supporting copy stays short: story paragraphs use a 35-character measure; detail copy uses approximately 33 characters. The story's mobile heading scales from 36px to 48px; its mobile body uses 13px with a 1.5 line height. Section-specific headline variations are deliberate and remain in the corresponding stylesheet.

## Layout

Use generous image areas and a fluid gutter. Main narrative text and the continuation are centered within a 1536px cap. A full-viewport visual surface may extend beyond that content cap; never constrain the construction canvas with the old whole-page maximum width.

The principal mobile breakpoint is 700px. The story places copy above the house on mobile and to its left on desktop. The continuation switches its process, detail and enquiry compositions to a vertical flow. Mobile content shells have 20px side margins; the story copy has 24px side padding. Desktop gallery frames occupy 86% of the track with a visible next image, changing to 90% on mobile. These are the current home surface's proportions, not a mandatory layout for every future page.

## Elevation & Depth

The interface is flat by default. Fine borders, forest-green fields and selected tonal surfaces establish hierarchy. The architectural model provides dimensional depth through an orthographic camera, shaded geometry, grain and cast shadows. Photography supplies its own depth; keep the process image stationary during interactions.

The mobile story navigation uses a soft shadow (`0 14px 25px #203d2c18`) to separate an open menu. Image captions use a text shadow (`0 2px 12px #0009`) for legibility. These are local affordances, not a general card elevation system.

## Shapes

Use rectangular media and nearly square controls with the small control radius. Circles are reserved for numbered detail hotspots, detail identifiers and process points. Rules are thin and straight. The current page has no rounded card grid and no standalone text-entry field: enquiry choices are outlined radio tiles.

## Components

### Buttons

The story action pairs green with cream text and an upward-right arrow. It darkens on hover and nudges the arrow outward. Forward and outlined arrow controls share a square footprint; the former uses a solid forest field. Hover feedback is brief, and disabled arrow controls retain their position with reduced opacity. Global links and buttons use a visible 2px focus outline with a 5px offset; the construction story uses Construction Green for that outline.

### Navigation and chapters

Navigation is a small row of plain links; mobile replaces it with a menu button and stacked panel. Chapter controls are quiet text buttons with a tonal active state and a fine progress rule. An opaque cream background under the controls and illustrative label keeps them legible over the scene. Preserve the active chapter semantics and keyboard focus. The home surface brief owns the chapter sequence and scroll positions.

### Enquiry choices

Radio tiles form three-column groups. A selected tile fills with forest green and cream text; an unselected tile retains a thin sage border. Focus belongs to the entire tile. The full-width enquiry action prepares an email draft and retains helper copy explaining that the visitor sends it.

### Image gallery

Use a dominant rectangular image with an adjacent preview, caption link, category tabs and compact arrow controls. The selected category receives an underline. Keep the illustrative disclosure near the gallery. Drag, touch, keyboard and button selection share one gallery position.

### Process rail and detail hotspots

The process rail uses five small circular points and a thin moving marker; text panels retain a stable footprint. The detail photograph uses circular numbered controls and a selected outer ring. Content transitions use brief opacity changes without moving the surrounding layout.

### Architectural illustration

Use actual Three.js geometry and the incumbent duotone shader. Scroll-driven motion reveals construction relationships, with one reversible timeline coordinating assembly and camera framing. Preserve quiet reading space around text, static chapter selection under reduced motion, and the WebGL fallback. Geometry and construction order are illustrative, not an engineering specification.

## Do's and Don'ts

### Do:

- Do preserve the supplied logo and Switzer family.
- Do preserve the existing duotone shader when changing the illustrative house.
- Do use fine rules and tonal changes to distinguish interface states.
- Do preserve visible keyboard focus, touch controls and reduced-motion alternatives.
- Do keep imagery explicitly illustrative and contact paths usable.

### Don't:

- Don't replace the real Three.js construction story with raster image plates.
- Don't introduce a new palette or photorealistic material treatment into the house.
- Don't imply generated imagery depicts verified company projects or staff.
- Don't add entrance animations to the enquiry/footer.
