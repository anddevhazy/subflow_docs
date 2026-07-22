# Subflow Docs

The documentation site for **Subflow**, a multi-tenant Subscription-as-a-Service platform built on [Monnify](https://monnify.com)'s payment rails. It covers the product from three angles: merchants running recurring billing, subscribers managing their own plans, and developers integrating the API, plus the architecture and security posture underneath it all.

Built with Next.js (App Router), React 19, Tailwind CSS v4, and MDX-style content authored directly in TSX.

## What's in here

- **Get started**: mission, how the system works end to end, and a five-call quick start (API key, plan, customer, subscription, webhook).
- **Core concepts**: the subscription lifecycle state machine, the event store that backs webhooks/notifications/analytics, and recovery (dunning) orchestration.
- **For merchants**: plans, onboarding, billing & invoicing, payments, payouts, and analytics.
- **Customer portal**: the magic-link, passwordless portal subscribers use to manage their own subscription.
- **Developer**: authentication, webhooks, rate limits, service info, and an interactive playground with code samples and event catalog.
- **Channels**: web, email, WhatsApp, SMS, and USSD delivery surfaces for notifications and recovery.
- **Architecture**: module breakdown, the Monnify integration (Checkout, tokenised charges, transfers), data flow, async/queue processing, resilience, and a live mission-control WebSocket feed.
- **Security & trust**: auth posture, HMAC-SHA256 webhook signing/verification, and data protection.

## Getting started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Build for production         |
| `npm run start` | Serve the production build   |
| `npm run lint`  | Run ESLint                   |

## Project structure

```
app/(docs)/          Route group for the docs shell, [...slug] page, and API reference
lib/content/pages/    Page content, organized by section (merchants/, developer/, architecture/, etc.)
lib/content/registry.tsx  Maps slugs to page content
lib/nav/config.ts     Sidebar navigation, icons, and page descriptions
components/docs/      Docs shell, sidebar, TOC, code blocks, callouts, Mermaid diagrams, etc.
providers/            Theme provider (next-themes)
assets/, public/      Brand assets, logos, and media
```

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS v4, `class-variance-authority`, `tailwind-merge`
- **UI:** `@base-ui/react`, `lucide-react` icons, `next-themes` for light/dark mode
- **Content:** Syntax highlighting via `shiki`, diagrams via `mermaid`, PDF export via `jspdf`

## Note on this codebase

This project runs on a customized version of Next.js with breaking changes from the framework you may already know. See [AGENTS.md](./AGENTS.md) and `node_modules/next/dist/docs/` before making changes.
