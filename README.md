# Tomoroga Construct

Interactive construction company website prototype with a beige, centered hero and a detailed architectural Three.js scene.

## Development

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev -- --port 3001
```

Open http://localhost:3001/.

## Validation

```sh
npx tsc --noEmit
npm run build
```

## Stack and interactions

React, Vinext, TypeScript, Tailwind CSS, shadcnblocks Hero8, Three.js and GSAP. The building supports assembly stages, replay and desktop drag rotation. Mobile uses direct stage controls and native page scrolling; reduced motion selects states immediately.

The scene is illustrative, not a factual model of a completed commission. The supplied company logo is the sole raster image.

## Local credentials

The optional SHADCNBLOCKS_TOKEN belongs in ignored `.env.local`; it is only needed to fetch licensed registry components. The website runs without that token. Do not commit environment files or keys.
