import type { LucideIcon } from "lucide-react";
import {
  Handshake,
  Compass,
  Zap,
  Target,
  Users,
  Store,
  FileText,
  CreditCard,
  Receipt,
  Lock,
  LineChart,
  RotateCw,
  Book,
  Monitor,
  MessageCircle,
  Mail,
  Phone,
  Key,
  Bell,
  Timer,
  Building2,
  Puzzle,
  Plug,
  FolderTree,
  Boxes,
  Shield,
  CheckCircle2,
  MessageSquareText,
  Wallet,
  Radio,
  Server,
  TerminalSquare,
  DoorOpen,
  SlidersHorizontal,
  Hand,
  Settings,
} from "lucide-react";

export type NavItem = { slug: string; title: string };
export type NavGroup = { group: string; items: NavItem[] };

export const ICONS: Record<string, LucideIcon> = {
  introduction: Handshake,
  "introduction-tolu": Handshake,
  "how-it-works": Compass,
  "quick-start": Zap,
  mission: Target,
  "the-team": Users,
  "merchants/overview": Store,
  "merchants/create-a-plan": FileText,
  "merchants/onboard-and-collect-payment": CreditCard,
  "merchants/billing-and-invoicing": Receipt,
  "merchants/payments": Wallet,
  "merchants/payouts": Wallet,
  "merchants/analytics": LineChart,
  "merchants/customer-portal/overview": DoorOpen,
  "merchants/customer-portal/configure": SlidersHorizontal,
  "subscribers/overview": Hand,
  "subscribers/manage-your-subscription": Settings,
  "concepts/subscription-lifecycle": RotateCw,
  "concepts/event-store": Book,
  "concepts/recovery-orchestration": Compass,
  "channels/web": Monitor,
  "channels/email": Mail,
  "channels/whatsapp": MessageCircle,
  "channels/sms": MessageSquareText,
  "channels/ussd": Phone,
  "developer/authentication": Key,
  "developer/webhooks": Bell,
  "developer/rate-limits": Timer,
  "developer/service-info": Server,
  "developer/playground": TerminalSquare,
  "architecture/overview": Building2,
  "architecture/modules": Puzzle,
  "architecture/monnify-integration": Plug,
  "architecture/data-flow": FolderTree,
  "architecture/queues-and-async": Boxes,
  "architecture/resilience": Shield,
  "architecture/mission-control": Radio,
  "security/overview": Shield,
  "security/webhook-verification": CheckCircle2,
  "security/data-protection": Lock,
};

export const NAV: NavGroup[] = [
  {
    group: "Get started",
    items: [
      { slug: "introduction-tolu", title: "Introduction" },
      // { slug: "introduction", title: "Introduction" },
      { slug: "mission", title: "The mission" },
      { slug: "how-it-works", title: "How it works" },
      { slug: "the-team", title: "The team" },
      { slug: "quick-start", title: "Quick start" },
    ],
  },
  {
    group: "Core concepts",
    items: [
      {
        slug: "concepts/subscription-lifecycle",
        title: "Subscription lifecycle",
      },
      { slug: "concepts/event-store", title: "The event store" },
      {
        slug: "concepts/recovery-orchestration",
        title: "Recovery orchestration",
      },
    ],
  },
  {
    group: "For merchants",
    items: [
      { slug: "merchants/overview", title: "For merchants" },
      { slug: "merchants/create-a-plan", title: "Create a plan" },
      {
        slug: "merchants/onboard-and-collect-payment",
        title: "Onboard a customer",
      },
      { slug: "merchants/billing-and-invoicing", title: "Billing & invoicing" },
      { slug: "merchants/payments", title: "Payments" },
      { slug: "merchants/payouts", title: "Payouts" },
      { slug: "merchants/analytics", title: "Analytics" },
    ],
  },
  {
    group: "Customer portal",
    items: [
      { slug: "merchants/customer-portal/overview", title: "Customer portal" },
      {
        slug: "merchants/customer-portal/configure",
        title: "Configure the portal",
      },
    ],
  },
  {
    group: "For subscribers",
    items: [
      { slug: "subscribers/overview", title: "For subscribers" },
      {
        slug: "subscribers/manage-your-subscription",
        title: "Manage your subscription",
      },
    ],
  },
  {
    group: "Developer",
    items: [
      { slug: "developer/authentication", title: "Authentication" },
      { slug: "developer/webhooks", title: "Webhooks" },
      { slug: "developer/rate-limits", title: "Rate limits" },
      { slug: "developer/service-info", title: "Service info" },
      { slug: "developer/playground", title: "Playground" },
    ],
  },
  {
    group: "Channels",
    items: [
      { slug: "channels/web", title: "Web" },
      { slug: "channels/email", title: "Email" },
      { slug: "channels/whatsapp", title: "WhatsApp" },
      { slug: "channels/sms", title: "SMS" },
      { slug: "channels/ussd", title: "USSD" },
    ],
  },
  {
    group: "Architecture",
    items: [
      { slug: "architecture/overview", title: "Architecture" },
      { slug: "architecture/modules", title: "Modules" },
      { slug: "architecture/monnify-integration", title: "Monnify integration" },
      { slug: "architecture/data-flow", title: "Data flow" },
      {
        slug: "architecture/queues-and-async",
        title: "Queues & async processing",
      },
      { slug: "architecture/resilience", title: "Resilience & scale" },
      { slug: "architecture/mission-control", title: "Mission control" },
    ],
  },
  {
    group: "Security & trust",
    items: [
      { slug: "security/overview", title: "Security overview" },
      {
        slug: "security/webhook-verification",
        title: "Webhook signature verification",
      },
      { slug: "security/data-protection", title: "Data & encryption posture" },
    ],
  },
];

export const DESCRIPTIONS: Record<string, string> = {
  "introduction-tolu":
    "Draft B. Tolu almost loses a course subscription to a badly timed decline; Adaeze almost loses the revenue. Compare against Introduction.",
  "how-it-works":
    "A merchant creates a plan. A customer subscribes. Monnify collects the charge. If it fails, recovery kicks in. The whole arc, end to end, in one page.",
  "quick-start":
    "Five real API calls: create a key, a plan, a customer, a subscription, and a webhook. No fabricated shortcuts, no endpoints that don't exist.",
  mission:
    "The objectives behind the build, and the six things explicitly left out of this release.",
  "the-team":
    "The people behind Subflow, and why recurring billing in Nigeria needed a second look.",
  "merchants/overview":
    "Stop building billing logic in-house. Plans, customers, invoices, dunning, analytics, one API, one dashboard.",
  "merchants/create-a-plan":
    "Name, price, interval, trial. From an idea for a pricing tier to something a customer can subscribe to.",
  "merchants/onboard-and-collect-payment":
    "Tokenise a card once. Charge it on every billing cycle after, without asking the customer again.",
  "merchants/billing-and-invoicing":
    "Invoices generate themselves. Charges fire themselves. Proration on a plan change is previewed today, not yet charged automatically.",
  "merchants/payments":
    "Checkout sessions, charges, and payment attempts, the money-movement record underneath every invoice.",
  "merchants/payouts":
    "Set a bank account once. Every settled payment moves out to it automatically, no manual withdrawal step.",
  "merchants/analytics":
    "MRR, churn, recovery rate, plan performance, computed from the same event store that powers your webhooks.",
  "merchants/customer-portal/overview":
    "A magic-link email and a 24-hour session. View, pause, resume, cancel, reactivate, switch plan, update contact details.",
  "merchants/customer-portal/configure":
    "Toggles for plan switching, cancellation, and what a subscriber can edit. One of them doesn't reach the live portal yet.",
  "concepts/subscription-lifecycle":
    "Eight states. One state machine. Why `past_due` and `grace_period` are different states, not the same failure twice.",
  "concepts/event-store":
    "Every domain event, persisted once, read by webhooks, notifications, and analytics. One source of truth, not three.",
  "concepts/recovery-orchestration":
    "One event triggers a real email, a Twilio-backed WhatsApp or SMS send, and three single-use links. What's live today, and what's still a stand-in.",
  "channels/web":
    "The API and docs site, the merchant dashboard, and a customer portal, three applications, one API underneath.",
  "subscribers/overview":
    "Request a link by email. View, pause, resume, cancel, reactivate, or switch plan yourself, no support ticket, no password.",
  "subscribers/manage-your-subscription":
    "One email, one link, a 24-hour session. No password, and it doesn't touch the merchant's own dashboard login.",
  "channels/email":
    "The baseline channel. Every recovery sequence sends one, whether or not WhatsApp or SMS also fire.",
  "channels/whatsapp":
    "A real Twilio send on every failed charge, with a simulated stand-in if Twilio isn't configured. Inbound taps aren't wired yet.",
  "channels/sms":
    "A real Twilio text on a failed charge. Replying to it doesn't do anything yet, there's no inbound receiver.",
  "channels/ussd":
    "A session endpoint shaped for a telco short code. There's no telco behind it yet, so it doesn't reach a real handset today.",
  "developer/authentication":
    "Live and test keys per merchant. Bearer auth, rotation, and what happens the moment a request lands.",
  "developer/webhooks":
    "Subscribe once. Every domain event, delivered with retry, dead-letter handling, and replay by subscription ID or time range.",
  "developer/rate-limits":
    "One global limit, 100 requests per 60 seconds, shared by every caller. No per-key tiers yet.",
  "developer/service-info":
    "A debug console for the one webhook direction that's easy to get wrong: Monnify calling into you, not you calling out.",
  "developer/playground":
    "Code samples in four languages, five payment scenarios with the exact webhook they produce, and the full event catalog.",
  "architecture/overview":
    "One NestJS API. Postgres for the ledger. Redis and BullMQ for everything that shouldn't block a response.",
  "architecture/modules":
    "Nineteen domain modules and five shared-infrastructure ones. What each is responsible for, and who it talks to.",
  "architecture/monnify-integration":
    "Token issuance, Checkout, Tokenised-card Charge, and Transfers. Money moves in through Charge and back out through Transfers, automatically.",
  "architecture/data-flow":
    "How a single event, a payment failing, a subscription renewing, reaches webhooks, notifications, and analytics without three separate write paths.",
  "architecture/queues-and-async":
    "Dunning retries, webhook delivery, invoice generation. Why none of them happen inline on the request that triggered them.",
  "architecture/resilience":
    "Async by default, retried with backoff, degraded gracefully when WhatsApp, SMS, or email goes down for an hour.",
  "architecture/mission-control":
    "A live, per-merchant WebSocket feed of the same events that drive webhooks and analytics. Real, scoped, and running today.",
  "security/overview":
    "The defence-in-depth posture across authentication, webhook signing, and data at rest.",
  "security/webhook-verification":
    "Every webhook is signed with HMAC-SHA256 over the raw body. Here's exactly how to verify one, and one gap worth knowing about.",
  "security/data-protection":
    "Passwords and secrets are hashed today. AES-256-GCM at rest exists as a utility, but isn't applied to any stored field yet.",
};
