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

React, Vinext, TypeScript, Tailwind CSS, shadcnblocks Hero8, Three.js and GSAP. The building assembles on scroll and supports stage controls and desktop drag rotation. Mobile supports native page scrolling and stage controls; reduced motion selects states immediately. Additional sections include a draggable gallery, process tabs, detail hotspots, and an email enquiry form.

The scene is illustrative, not a factual model of a completed commission. Generated photographs in the additional sections are explicitly labelled illustrative.

## Local credentials

The optional SHADCNBLOCKS_TOKEN belongs in ignored `.env.local`; it is only needed to fetch licensed registry components. The website runs without that token. Do not commit environment files or keys.

## Vercel deployment

The existing production project is `tomoroga-construct` at https://tomoroga-construct.vercel.app/.

`vercel.json` installs from the npm lockfile and runs `npm run build:vercel`. This selects Nitro’s Vercel adapter and emits the server function and static assets in `.vercel/output` using Vercel’s Build Output API. The regular development and Sites/Cloudflare build remain available through `npm run dev` and `npm run build`.

Connect the repository to the existing Vercel project and deploy `main`. Do not publish `dist/` as a plain Vite site: that directory contains the Cloudflare build, not a Vercel homepage.
