# Tomoroga Construct

Romanian construction company website with a full-screen Three.js construction story and a two-step project enquiry form.

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
npm run test:enquiry
npm run build:vercel
```

## Stack and interactions

React, Vinext, TypeScript, Tailwind CSS, Three.js and GSAP. Native scrolling drives a reversible seven-chapter house assembly, with chapter controls and a static reduced-motion alternative. The scene is illustrative, not a factual model of a completed commission.

The story leads directly into the project enquiry. Gallery, process and material-detail sections are commented out in `components/home-sections.tsx`; their implementations remain in `components/archived-home-sections.tsx` for restoration.

## Direct enquiry delivery

The two-step form posts to `/api/enquiry`. Step one requires project type and locality; stage, timing, description, area and budget are optional. Step two requires a name and either phone or email. Server validation mirrors the required fields. Requests are delivered as plain-text emails to the fixed recipient `office@tomorogaconstruct.ro` using Resend.

Before enabling live sending:

1. Configure a sending domain in [Resend](https://resend.com/docs/dashboard/domains/introduction) and verify its DNS records.
2. Set `RESEND_API_KEY` and `ENQUIRY_FROM` in the Vercel project's Production environment. `ENQUIRY_FROM` must use the verified sending domain, for example `Tomoroga Construct <formular@your-verified-domain.ro>`. Set the same variables in ignored `.env.local` for local delivery testing. `.env.example` contains empty placeholders only.
3. Redeploy after adding the variables. Send an intentional test enquiry and confirm receipt in the company inbox before launch.

No email-service credentials were configured locally or in the Vercel project during implementation. Without them, the endpoint returns an honest unavailable state with a phone fallback; it never reports a successful send. A successful state requires a provider-confirmed message ID. Provider acceptance does not guarantee inbox delivery.

Validation includes request size/type checks, optional-value allowlists, a honeypot and same-origin checks. A stable idempotency key prevents duplicate provider sends when an unchanged submission is retried. There is no persistent submission database; failed requests retain values in the open form only. `npm run test:enquiry` uses mocked provider responses and sends no real email.

## Local credentials

The optional SHADCNBLOCKS_TOKEN belongs in ignored `.env.local`; it is only needed to fetch licensed registry components. The website runs without that token. Do not commit environment files or keys.

## Vercel deployment

The existing production project is `tomoroga-construct` at https://tomoroga-construct.vercel.app/.

`vercel.json` installs from the npm lockfile and runs `npm run build:vercel`. This selects Nitro’s Vercel adapter and emits the server function and static assets in `.vercel/output` using Vercel’s Build Output API. The regular development and Sites/Cloudflare build remain available through `npm run dev` and `npm run build`.

Connect the repository to the existing Vercel project and deploy `main`. Do not publish `dist/` as a plain Vite site: that directory contains the Cloudflare build, not a Vercel homepage.
