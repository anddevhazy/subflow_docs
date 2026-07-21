import { SWAGGER_URL } from "./constants";

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type ApiEndpointDoc = {
  method: HttpMethod;
  path: string;
  description: string;
  auth: "public" | "jwt" | "hmac";
  requestBody?: Record<string, unknown>;
  requestSchema?: {
    field: string;
    type: string;
    required?: boolean;
    description?: string;
  }[];
  queryParams?: { field: string; type: string; description?: string }[];
  exampleRequest?: string;
  exampleResponse: string;
  /** Defaults to "json". Set when exampleResponse isn't JSON, e.g. the HTML/plain-text recovery-channel endpoints. */
  responseLanguage?: "json" | "html" | "text";
  swaggerPath?: string;
};

export type ApiTagGroup = {
  tag: string;
  slug: string;
  description: string;
  endpoints: ApiEndpointDoc[];
};

const envelope = (data: unknown, message = "Request successful") =>
  JSON.stringify({ status: "success", data, message }, null, 2);

export const apiTagGroups: ApiTagGroup[] = [
  {
    tag: "Auth",
    slug: "auth",
    description:
      "Merchant authentication via JWT. Access tokens expire in 15 minutes; use refresh tokens to obtain new credentials.",
    endpoints: [
      {
        method: "POST",
        path: "/auth/signup",
        description: "Register a new merchant account and receive JWT tokens.",
        auth: "public",
        requestSchema: [
          { field: "businessName", type: "string", required: true },
          { field: "email", type: "string", required: true },
          {
            field: "password",
            type: "string",
            required: true,
            description: "Min 8 characters",
          },
          { field: "firstName", type: "string" },
          { field: "lastName", type: "string" },
          { field: "phone", type: "string" },
        ],
        exampleRequest: `{
  "businessName": "Acme SaaS Ltd",
  "email": "founder@acme.ng",
  "password": "securePass123",
  "firstName": "Ada",
  "lastName": "Okafor"
}`,
        exampleResponse: envelope(
          {
            user: {
              id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
              email: "founder@acme.ng",
              merchantId: "m1e2r3c4-h5a6-7890-merc-hant12345678",
              firstName: "Ada",
              lastName: "Okafor",
            },
            tokens: {
              accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              expiresIn: "15m",
            },
          },
          "Resource created successfully",
        ),
        swaggerPath: `${SWAGGER_URL}#/Auth/AuthController_signup`,
      },
      {
        method: "POST",
        path: "/auth/login",
        description: "Authenticate with email and password.",
        auth: "public",
        requestSchema: [
          { field: "email", type: "string", required: true },
          { field: "password", type: "string", required: true },
        ],
        exampleRequest: `{
  "email": "founder@acme.ng",
  "password": "securePass123"
}`,
        exampleResponse: envelope(
          {
            user: {
              id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
              email: "founder@acme.ng",
              merchantId: "m1e2r3c4-h5a6-7890-merc-hant12345678",
            },
            tokens: {
              accessToken: "eyJhbG...",
              refreshToken: "eyJhbG...",
              expiresIn: "15m",
            },
          },
          "Resource created successfully",
        ),
        swaggerPath: `${SWAGGER_URL}#/Auth/AuthController_login`,
      },
      {
        method: "POST",
        path: "/auth/refresh",
        description: "Exchange a refresh token for a new access token pair.",
        auth: "public",
        requestSchema: [
          { field: "refreshToken", type: "string", required: true },
        ],
        exampleRequest: `{ "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }`,
        exampleResponse: envelope(
          {
            user: {
              id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
              email: "founder@acme.ng",
              merchantId: "m1e2r3c4-h5a6-7890-merc-hant12345678",
            },
            tokens: {
              accessToken: "eyJhbG...",
              refreshToken: "eyJhbG...",
              expiresIn: "15m",
            },
          },
          "Resource created successfully",
        ),
      },
      {
        method: "POST",
        path: "/auth/password-reset/request",
        description: "Request a password-reset email for a merchant account.",
        auth: "public",
        requestSchema: [{ field: "email", type: "string", required: true }],
        exampleRequest: `{ "email": "founder@acme.ng" }`,
        exampleResponse: envelope(
          { message: "If the email exists, a reset link has been sent" },
          "Resource created successfully",
        ),
      },
      {
        method: "POST",
        path: "/auth/password-reset/confirm",
        description:
          "Confirm a password reset using the token emailed to the merchant.",
        auth: "public",
        requestSchema: [
          { field: "token", type: "string", required: true },
          {
            field: "newPassword",
            type: "string",
            required: true,
            description: "Min 8 characters",
          },
        ],
        exampleRequest: `{ "token": "prt_9f3a1c...", "newPassword": "aNewSecurePass456" }`,
        exampleResponse: envelope(
          { message: "Password reset successfully" },
          "Resource created successfully",
        ),
      },
    ],
  },
  {
    tag: "Merchants",
    slug: "merchants",
    description:
      "Your own merchant profile: business details, webhook URL, customer-portal settings, and the payout bank account that receives every settled payment automatically.",
    endpoints: [
      {
        method: "GET",
        path: "/merchants/me",
        description: "Get the current merchant's profile.",
        auth: "jwt",
        exampleResponse: envelope({
          id: "m1e2r3c4-h5a6-7890-merc-hant12345678",
          businessName: "Acme SaaS Ltd",
          phone: "+2348012345678",
          webhookUrl: "https://acme.ng/webhooks/subflow",
          bankCode: "058",
          bankName: "Guaranty Trust Bank",
          bankAccountNumber: "0123456789",
          bankAccountName: "ACME SAAS LTD",
          customerPortalSettings: {
            allowSwitchPlan: true,
            allowCancellation: true,
          },
          branding: {},
        }),
      },
      {
        method: "PATCH",
        path: "/merchants/me",
        description:
          "Update business details, webhook URL, payout bank account, or customer-portal settings. Only fields you include are changed.",
        auth: "jwt",
        requestSchema: [
          { field: "businessName", type: "string" },
          { field: "phone", type: "string" },
          { field: "branding", type: "object" },
          { field: "webhookUrl", type: "string" },
          { field: "bankCode", type: "string" },
          { field: "bankName", type: "string" },
          { field: "bankAccountNumber", type: "string" },
          { field: "bankAccountName", type: "string" },
          {
            field: "customerPortalSettings",
            type: "object",
            description:
              "See Configure the customer portal for the current caveat on this field.",
          },
        ],
        exampleRequest: `{
  "bankCode": "058",
  "bankAccountNumber": "0123456789",
  "bankAccountName": "ACME SAAS LTD"
}`,
        exampleResponse: envelope(
          {
            id: "m1e2r3c4-h5a6-7890-merc-hant12345678",
            bankCode: "058",
            bankAccountNumber: "0123456789",
            bankAccountName: "ACME SAAS LTD",
          },
          "Resource updated successfully",
        ),
      },
      {
        method: "GET",
        path: "/merchants/banks",
        description:
          "List Nigerian banks supported for payouts, sourced live from Monnify.",
        auth: "jwt",
        exampleResponse: envelope([
          { code: "058", name: "Guaranty Trust Bank" },
          { code: "011", name: "First Bank of Nigeria" },
        ]),
      },
      {
        method: "POST",
        path: "/merchants/bank/lookup",
        description:
          "Verify an account number against a bank before saving it as your payout account.",
        auth: "jwt",
        requestSchema: [
          { field: "accountNumber", type: "string", required: true },
          { field: "bankCode", type: "string", required: true },
        ],
        exampleRequest: `{ "accountNumber": "0123456789", "bankCode": "058" }`,
        exampleResponse: envelope({ accountName: "ACME SAAS LTD" }),
      },
    ],
  },
  {
    tag: "Portal",
    slug: "portal",
    description:
      "The customer-facing self-service surface. Public, token-based, no password. A subscriber requests a magic-link email and gets a 24-hour reusable session, not a single-use link.",
    endpoints: [
      {
        method: "POST",
        path: "/portal/login",
        description:
          "Request a magic login link for the customer portal, emailed to the customer.",
        auth: "public",
        requestSchema: [
          { field: "email", type: "string", required: true },
          {
            field: "merchantId",
            type: "string",
            required: true,
            description: "UUID",
          },
        ],
        exampleRequest: `{ "email": "chidi@example.com", "merchantId": "m1e2r3c4-h5a6-7890-merc-hant12345678" }`,
        exampleResponse: envelope(
          {
            message:
              "Login link has been successfully generated and sent via email.",
          },
          "Resource created successfully",
        ),
      },
      {
        method: "GET",
        path: "/portal/session",
        description:
          "Get session state: customer, subscription, invoices, payment history, and available plans.",
        auth: "public",
        queryParams: [
          {
            field: "token",
            type: "string",
            description: "The session token from the emailed link, required",
          },
        ],
        exampleResponse: envelope({
          customer: {
            id: "c1u2s3t4-d5e6-7890-cust-123456789abc",
            name: "Chidi Nwosu",
            email: "chidi@example.com",
          },
          subscription: {
            id: "s1u2b3s4-d5e6-7890-subs-123456789abc",
            status: "active",
            currentPeriodEnd: "2026-08-01T00:00:00.000Z",
            plan: {
              id: "p1l2a3n4-d5e6-7890-plan-123456789abc",
              name: "Pro Plan",
              amount: 15000,
              currency: "NGN",
            },
          },
          invoices: [{ id: "i1n2v3o4-...", status: "paid", total: 15000 }],
          payments: [
            {
              id: "9a1b2c3d-...",
              status: "succeeded",
              createdAt: "2026-07-01T10:30:00.000Z",
            },
          ],
          plans: [
            {
              id: "p1l2a3n4-...",
              name: "Pro Plan",
              amount: 15000,
              currency: "NGN",
            },
          ],
          config: {},
          branding: {},
        }),
      },
      {
        method: "POST",
        path: "/portal/session/action",
        description:
          "Execute an action: PAUSE_SUBSCRIPTION, RESUME_SUBSCRIPTION, CANCEL_SUBSCRIPTION, REACTIVATE_SUBSCRIPTION, SWITCH_PLAN, or UPDATE_CONTACT. No payment-method action exists. The API doesn't check the merchant's portal settings before executing, those are UI hints only.",
        auth: "public",
        queryParams: [
          {
            field: "token",
            type: "string",
            description: "The session token from the emailed link, required",
          },
        ],
        requestSchema: [
          { field: "action", type: "string", required: true },
          {
            field: "data",
            type: "object",
            description: "e.g. { planId } for SWITCH_PLAN",
          },
        ],
        exampleRequest: `{ "action": "SWITCH_PLAN", "data": { "planId": "p1l2a3n4-d5e6-7890-plan-123456789abc" } }`,
        exampleResponse: envelope(
          {
            customer: {
              id: "c1u2s3t4-d5e6-7890-cust-123456789abc",
              name: "Chidi Nwosu",
            },
            subscription: { id: "s1u2b3s4-...", status: "active" },
          },
          "Resource created successfully",
        ),
      },
    ],
  },
  {
    tag: "API Keys",
    slug: "api-keys",
    description:
      "Programmatic access keys for server-to-server integrations. Keys use nsub_live_ or nsub_test_ prefixes. Issuing, listing, rotating, and revoking keys works today; authenticating a request WITH one of these keys does not yet, every protected endpoint below still expects a JWT bearer token, not an API key, until that guard is wired up.",
    endpoints: [
      {
        method: "POST",
        path: "/api-keys",
        description: "Create a new API key. The raw key is only returned once.",
        auth: "jwt",
        requestSchema: [
          {
            field: "environment",
            type: "enum",
            required: true,
            description: "live | test",
          },
          { field: "name", type: "string", description: "Friendly label" },
        ],
        exampleRequest: `{ "environment": "test", "name": "Production Backend" }`,
        exampleResponse: envelope(
          {
            apiKey: {
              id: "k1e2y3i4-d5e6-7890-key1-234567890abc",
              prefix: "nsub_test_",
              lastFour: "9c2e",
              environment: "test",
              name: "Production Backend",
              isActive: true,
            },
            rawKey: "nsub_test_7f3a9c2e1b8d4f6a0e5c3d2b1a9f8e7d6c5b4a3f",
          },
          "Resource created successfully",
        ),
      },
      {
        method: "GET",
        path: "/api-keys",
        description: "List all API keys for the merchant.",
        auth: "jwt",
        exampleResponse: envelope([
          {
            id: "k1e2y3i4-d5e6-7890-key1-234567890abc",
            prefix: "nsub_test_",
            lastFour: "9c2e",
            environment: "test",
            name: "Production Backend",
            isActive: true,
            createdAt: "2026-07-01T10:00:00.000Z",
          },
        ]),
      },
      {
        method: "DELETE",
        path: "/api-keys/:id",
        description: "Revoke an API key immediately.",
        auth: "jwt",
        exampleResponse: envelope(
          {
            id: "k1e2y3i4-d5e6-7890-key1-234567890abc",
            isActive: false,
            revokedAt: "2026-07-02T14:30:00.000Z",
          },
          "Resource deleted successfully",
        ),
      },
      {
        method: "POST",
        path: "/api-keys/:id/rotate",
        description: "Revoke the current key and issue a new one atomically.",
        auth: "jwt",
        exampleResponse: envelope(
          {
            apiKey: {
              id: "k2e3y4i5-d6e7-8901-key2-345678901bcd",
              prefix: "nsub_test_",
              lastFour: "4f6a",
            },
            rawKey: "nsub_test_8b1d4e7f2a9c3e6d1f0b5a4c8e7d2f1b0a9c8e7d",
          },
          "Resource created successfully",
        ),
      },
    ],
  },
  {
    tag: "Plans",
    slug: "plans",
    description:
      "Define recurring billing plans with intervals, trial periods, and pricing.",
    endpoints: [
      {
        method: "POST",
        path: "/plans",
        description: "Create a new subscription plan.",
        auth: "jwt",
        requestSchema: [
          { field: "name", type: "string", required: true },
          { field: "description", type: "string" },
          {
            field: "amount",
            type: "number",
            required: true,
            description: "Amount in major currency units",
          },
          { field: "currency", type: "string", description: "Default: NGN" },
          {
            field: "interval",
            type: "enum",
            required: true,
            description: "monthly | quarterly | yearly | custom",
          },
          { field: "trialDays", type: "number", description: "Default: 0" },
          {
            field: "customIntervalDays",
            type: "number",
            description: "Required when interval is custom",
          },
          {
            field: "isActive",
            type: "boolean",
            description: "Default: true. Also settable on PATCH.",
          },
        ],
        exampleRequest: `{
  "name": "Pro Plan",
  "description": "Full access to all features",
  "amount": 15000,
  "currency": "NGN",
  "interval": "monthly",
  "trialDays": 14
}`,
        exampleResponse: envelope(
          {
            id: "p1l2a3n4-d5e6-7890-plan-123456789abc",
            name: "Pro Plan",
            amount: "15000.00",
            currency: "NGN",
            interval: "monthly",
            trialDays: 14,
            isActive: true,
          },
          "Resource created successfully",
        ),
      },
      {
        method: "GET",
        path: "/plans",
        description: "List plans with pagination.",
        auth: "jwt",
        queryParams: [
          { field: "page", type: "number", description: "Default: 1" },
          {
            field: "limit",
            type: "number",
            description: "Default: 20, max: 100",
          },
        ],
        exampleResponse: envelope({
          data: [
            {
              id: "p1l2a3n4-d5e6-7890-plan-123456789abc",
              name: "Pro Plan",
              amount: "15000.00",
              interval: "monthly",
            },
          ],
          total: 1,
        }),
      },
      {
        method: "GET",
        path: "/plans/:id",
        description: "Retrieve a single plan by ID.",
        auth: "jwt",
        exampleResponse: envelope({
          id: "p1l2a3n4-d5e6-7890-plan-123456789abc",
          name: "Pro Plan",
          amount: "15000.00",
          currency: "NGN",
          interval: "monthly",
          trialDays: 14,
          isActive: true,
        }),
      },
      {
        method: "PATCH",
        path: "/plans/:id",
        description: "Update plan details. Partial updates supported.",
        auth: "jwt",
        exampleRequest: `{ "amount": 18000, "description": "Updated pricing" }`,
        exampleResponse: envelope(
          {
            id: "p1l2a3n4-d5e6-7890-plan-123456789abc",
            name: "Pro Plan",
            amount: "18000.00",
          },
          "Resource updated successfully",
        ),
      },
      {
        method: "DELETE",
        path: "/plans/:id",
        description:
          "Soft-deactivate a plan. Existing subscriptions are unaffected.",
        auth: "jwt",
        exampleResponse: envelope(
          {
            id: "p1l2a3n4-d5e6-7890-plan-123456789abc",
            isActive: false,
          },
          "Resource deleted successfully",
        ),
      },
    ],
  },
  {
    tag: "Customers",
    slug: "customers",
    description: "Manage end-customers who subscribe to your plans.",
    endpoints: [
      {
        method: "POST",
        path: "/customers",
        description: "Create a new customer record.",
        auth: "jwt",
        requestSchema: [
          { field: "name", type: "string", required: true },
          { field: "email", type: "string", required: true },
          { field: "phone", type: "string" },
          { field: "metadata", type: "object" },
        ],
        exampleRequest: `{
  "name": "Chidi Nwosu",
  "email": "chidi@example.com",
  "phone": "+2348012345678",
  "metadata": { "company": "Nwosu Ventures" }
}`,
        exampleResponse: envelope(
          {
            id: "c1u2s3t4-d5e6-7890-cust-123456789abc",
            name: "Chidi Nwosu",
            email: "chidi@example.com",
            phone: "+2348012345678",
            metadata: { company: "Nwosu Ventures" },
          },
          "Resource created successfully",
        ),
      },
      {
        method: "GET",
        path: "/customers",
        description: "List customers with pagination.",
        auth: "jwt",
        queryParams: [
          { field: "page", type: "number" },
          { field: "limit", type: "number" },
        ],
        exampleResponse: envelope({
          data: [
            {
              id: "c1u2s3t4-d5e6-7890-cust-123456789abc",
              name: "Chidi Nwosu",
              email: "chidi@example.com",
            },
          ],
          total: 1,
        }),
      },
      {
        method: "GET",
        path: "/customers/:id",
        description: "Retrieve a customer by ID.",
        auth: "jwt",
        exampleResponse: envelope({
          id: "c1u2s3t4-d5e6-7890-cust-123456789abc",
          name: "Chidi Nwosu",
          email: "chidi@example.com",
        }),
      },
      {
        method: "PATCH",
        path: "/customers/:id",
        description: "Update customer details.",
        auth: "jwt",
        exampleRequest: `{ "phone": "+2348098765432" }`,
        exampleResponse: envelope(
          {
            id: "c1u2s3t4-d5e6-7890-cust-123456789abc",
            phone: "+2348098765432",
          },
          "Resource updated successfully",
        ),
      },
    ],
  },
  {
    tag: "Subscriptions",
    slug: "subscriptions",
    description:
      "Create and manage recurring subscriptions. Creating a subscription returns a Monnify checkout URL for the initial payment.",
    endpoints: [
      {
        method: "POST",
        path: "/subscriptions",
        description:
          "Create a subscription and initiate Monnify checkout for the first invoice.",
        auth: "jwt",
        requestSchema: [
          { field: "customerId", type: "uuid", required: true },
          { field: "planId", type: "uuid", required: true },
          { field: "callbackUrl", type: "url", required: true },
          { field: "metadata", type: "object" },
        ],
        exampleRequest: `{
  "customerId": "c1u2s3t4-d5e6-7890-cust-123456789abc",
  "planId": "p1l2a3n4-d5e6-7890-plan-123456789abc",
  "callbackUrl": "https://acme.ng/billing/callback",
  "metadata": { "source": "onboarding" }
}`,
        exampleResponse: envelope(
          {
            subscription: {
              id: "s1u2b3s4-d5e6-7890-subs-123456789abc",
              status: "pending",
              customerId: "c1u2s3t4-d5e6-7890-cust-123456789abc",
              planId: "p1l2a3n4-d5e6-7890-plan-123456789abc",
            },
            checkoutUrl: "https://checkout.monnify.com/pay/abc123",
            paymentId: "9a1b2c3d-e4f5-6789-paym-123456789abc",
            invoiceId: "i1n2v3o4-d5e6-7890-inv1-234567890abc",
          },
          "Resource created successfully",
        ),
      },
      {
        method: "GET",
        path: "/subscriptions",
        description: "List all subscriptions with customer and plan relations.",
        auth: "jwt",
        exampleResponse: envelope([
          {
            id: "s1u2b3s4-d5e6-7890-subs-123456789abc",
            status: "active",
            customer: { name: "Chidi Nwosu" },
            plan: { name: "Pro Plan" },
          },
        ]),
      },
      {
        method: "GET",
        path: "/subscriptions/:id",
        description: "Get subscription details by ID.",
        auth: "jwt",
        exampleResponse: envelope({
          id: "s1u2b3s4-d5e6-7890-subs-123456789abc",
          status: "active",
          currentPeriodStart: "2026-07-01T00:00:00.000Z",
          currentPeriodEnd: "2026-08-01T00:00:00.000Z",
        }),
      },
      {
        method: "POST",
        path: "/subscriptions/:id/pause",
        description: "Pause an active subscription. Sets status to suspended.",
        auth: "jwt",
        exampleResponse: envelope(
          {
            id: "s1u2b3s4-d5e6-7890-subs-123456789abc",
            status: "suspended",
            pausedAt: "2026-07-15T10:00:00.000Z",
          },
          "Resource created successfully",
        ),
      },
      {
        method: "POST",
        path: "/subscriptions/:id/resume",
        description: "Resume a paused subscription. Sets status to active.",
        auth: "jwt",
        exampleResponse: envelope(
          {
            id: "s1u2b3s4-d5e6-7890-subs-123456789abc",
            status: "active",
          },
          "Resource created successfully",
        ),
      },
      {
        method: "POST",
        path: "/subscriptions/:id/cancel",
        description:
          "Cancel a subscription immediately. Takes no body; there's no period-end option today.",
        auth: "jwt",
        exampleResponse: envelope(
          {
            id: "s1u2b3s4-d5e6-7890-subs-123456789abc",
            status: "cancelled",
            cancelledAt: "2026-07-20T12:00:00.000Z",
          },
          "Resource created successfully",
        ),
      },
      {
        method: "POST",
        path: "/subscriptions/:id/reactivate",
        description: "Reactivate a cancelled subscription.",
        auth: "jwt",
        exampleResponse: envelope(
          {
            id: "s1u2b3s4-d5e6-7890-subs-123456789abc",
            status: "active",
          },
          "Resource created successfully",
        ),
      },
      {
        method: "PATCH",
        path: "/subscriptions/:id/plan",
        description:
          "Change a subscription's plan. Computes a proration preview; today this does not itself collect or credit a mid-cycle charge, see Billing & invoicing in the guide docs.",
        auth: "jwt",
        requestSchema: [{ field: "newPlanId", type: "uuid", required: true }],
        exampleRequest: `{ "newPlanId": "p2l3a4n5-d6e7-8901-plan-234567890bcd" }`,
        exampleResponse: envelope(
          {
            subscription: {
              id: "s1u2b3s4-d5e6-7890-subs-123456789abc",
              planId: "p2l3a4n5-d6e7-8901-plan-234567890bcd",
            },
            proration: { creditAmount: "5000.00", chargeAmount: "25000.00" },
          },
          "Resource updated successfully",
        ),
      },
    ],
  },
  {
    tag: "Invoices",
    slug: "invoices",
    description:
      "View billing invoices generated for subscription renewals and one-time charges.",
    endpoints: [
      {
        method: "GET",
        path: "/invoices",
        description: "List invoices with pagination.",
        auth: "jwt",
        queryParams: [
          { field: "page", type: "number" },
          { field: "limit", type: "number" },
        ],
        exampleResponse: envelope({
          data: [
            {
              id: "i1n2v3o4-d5e6-7890-inv1-234567890abc",
              invoiceNumber: "INV-2026-00042",
              status: "paid",
              total: "15000.00",
              currency: "NGN",
            },
          ],
          total: 1,
        }),
      },
      {
        method: "GET",
        path: "/invoices/:id",
        description: "Get invoice with line items.",
        auth: "jwt",
        exampleResponse: envelope({
          id: "i1n2v3o4-d5e6-7890-inv1-234567890abc",
          invoiceNumber: "INV-2026-00042",
          status: "paid",
          subtotal: "15000.00",
          tax: "0.00",
          total: "15000.00",
          currency: "NGN",
          items: [
            {
              description: "Pro Plan (July 2026)",
              quantity: 1,
              unitAmount: "15000.00",
              totalAmount: "15000.00",
            },
          ],
          paidAt: "2026-07-01T10:30:00.000Z",
        }),
      },
    ],
  },
  {
    tag: "Payments",
    slug: "payments",
    description:
      "Process payments via Monnify checkout and track payment attempts.",
    endpoints: [
      {
        method: "POST",
        path: "/payments/checkout",
        description:
          "Create a Monnify checkout session for an outstanding invoice.",
        auth: "jwt",
        requestSchema: [
          { field: "invoiceId", type: "uuid", required: true },
          { field: "callbackUrl", type: "url", required: true },
        ],
        exampleRequest: `{
  "invoiceId": "i1n2v3o4-d5e6-7890-inv1-234567890abc",
  "callbackUrl": "https://acme.ng/billing/callback"
}`,
        exampleResponse: envelope(
          {
            checkoutUrl: "https://checkout.monnify.com/pay/def456",
            paymentId: "9b2c3d4e-f5a6-7890-paym-234567890bcd",
          },
          "Resource created successfully",
        ),
      },
      {
        method: "GET",
        path: "/payments",
        description: "List payments with pagination.",
        auth: "jwt",
        exampleResponse: envelope({
          data: [
            {
              id: "9a1b2c3d-e4f5-6789-paym-123456789abc",
              status: "succeeded",
              amount: "15000.00",
              currency: "NGN",
            },
          ],
          total: 1,
        }),
      },
      {
        method: "GET",
        path: "/payments/:id",
        description: "Get payment details including attempt history.",
        auth: "jwt",
        exampleResponse: envelope({
          id: "9a1b2c3d-e4f5-6789-paym-123456789abc",
          status: "succeeded",
          amount: "15000.00",
          monnifyTransactionId: "TXN-MONNIFY-001234",
          paidAt: "2026-07-01T10:30:00.000Z",
          attempts: [{ attemptNumber: 1, status: "succeeded" }],
        }),
      },
    ],
  },
  {
    tag: "Webhooks",
    slug: "webhooks",
    description:
      "Register webhook endpoints to receive real-time events. Outbound deliveries are signed with HMAC-SHA256 over the raw request body and retried via BullMQ, five attempts over roughly four hours, then dead-lettered.",
    endpoints: [
      {
        method: "POST",
        path: "/webhooks",
        description: "Register a webhook endpoint for event notifications.",
        auth: "jwt",
        requestSchema: [
          { field: "url", type: "url", required: true },
          { field: "events", type: "string[]", required: true },
          { field: "description", type: "string" },
          { field: "isActive", type: "boolean", description: "Default: true" },
        ],
        exampleRequest: `{
  "url": "https://acme.ng/webhooks/nse",
  "events": [
    "subscription.created",
    "subscription.renewed",
    "payment.failed",
    "payment.recovered",
    "invoice.paid"
  ],
  "description": "Production webhook handler"
}`,
        exampleResponse: envelope(
          {
            id: "w1h2o3o4-d5e6-7890-hook-123456789abc",
            url: "https://acme.ng/webhooks/nse",
            events: ["subscription.created", "payment.failed", "invoice.paid"],
            secret: "whsec_auto_generated_secret",
            isActive: true,
          },
          "Resource created successfully",
        ),
      },
      {
        method: "GET",
        path: "/webhooks",
        description: "List registered webhook endpoints.",
        auth: "jwt",
        exampleResponse: envelope([
          {
            id: "w1h2o3o4-d5e6-7890-hook-123456789abc",
            url: "https://acme.ng/webhooks/nse",
            isActive: true,
          },
        ]),
      },
      {
        method: "GET",
        path: "/webhooks/:id/deliveries",
        description: "View delivery logs for a webhook.",
        auth: "jwt",
        exampleResponse: envelope([
          {
            id: "d1e2l3i4-d5e6-7890-del1-234567890abc",
            webhookId: "w1h2o3o4-d5e6-7890-hook-123456789abc",
            eventType: "invoice.paid",
            status: "delivered",
            attemptCount: 1,
            responseStatusCode: 200,
            deliveredAt: "2026-07-01T10:31:00.000Z",
          },
        ]),
      },
      {
        method: "POST",
        path: "/webhooks/replay",
        description:
          "Re-dispatch past events to your registered webhooks, filtered by subscription ID and/or a time range. Reads back from the event store, not a cache.",
        auth: "jwt",
        requestSchema: [
          { field: "subscriptionId", type: "uuid" },
          { field: "from", type: "string", description: "ISO 8601 date" },
          { field: "to", type: "string", description: "ISO 8601 date" },
        ],
        exampleRequest: `{
  "subscriptionId": "s1u2b3s4-d5e6-7890-subs-123456789abc",
  "from": "2026-08-01T00:00:00Z",
  "to": "2026-08-14T00:00:00Z"
}`,
        exampleResponse: envelope(
          { eventsMatched: 3 },
          "Resource created successfully",
        ),
      },
      {
        method: "POST",
        path: "/webhooks/monnify",
        description:
          "Inbound Monnify payment webhook (HMAC-verified against Monnify's own signing scheme, a public route so Monnify can reach it, not open to arbitrary callers who lack the secret).",
        auth: "hmac",
        exampleRequest: `{
  "event_type": "payment_success",
  "requestId": "req_monnify_001",
  "data": {
    "transaction": {
      "transactionId": "TXN-MONNIFY-001234",
      "merchantTxRef": "9a1b2c3d-e4f5-6789-paym-123456789abc",
      "transactionAmount": 15000,
      "responseCode": "00"
    }
  }
}`,
        exampleResponse: envelope({ received: true }, "Webhook received"),
      },
    ],
  },
  {
    tag: "Analytics",
    slug: "analytics",
    description:
      "Merchant-facing business metrics computed on demand from the event store: revenue, churn, recovery, plan performance, and activity feed. Rate fields (churnRate, recoveryRate, paymentSuccessRate, successRate, trialConversionRate) are percentages on a 0-100 scale, not 0-1 fractions.",
    endpoints: [
      {
        method: "GET",
        path: "/analytics/metrics",
        description: "Get the core subscription and revenue metrics snapshot.",
        auth: "jwt",
        exampleResponse: envelope({
          mrr: 4250000,
          arr: 51000000,
          churnRate: 3.2,
          recoveryRate: 61,
          activeSubscriptions: 284,
          failedPayments: 19,
          trialingSubscriptions: 12,
          pastDueSubscriptions: 7,
          gracePeriodSubscriptions: 4,
          suspendedSubscriptions: 2,
          cancelledSubscriptions: 31,
          pendingSubscriptions: 3,
          expiredSubscriptions: 6,
          totalSubscriptions: 349,
          totalCustomers: 271,
          newCustomersLast30Days: 18,
          totalRevenue: 128400000,
          revenueLast30Days: 4250000,
          successfulPayments: 302,
          paymentSuccessRate: 94,
          arpu: 14964,
          trialConversionRate: 68,
          outstandingInvoices: 5,
          outstandingInvoiceAmount: 75000,
          dunningSubscriptions: 11,
          averageDunningAttempts: 1.8,
        }),
      },
      {
        method: "GET",
        path: "/analytics/overview",
        description:
          "Get the full analytics payload for the merchant dashboard: metrics, payments, customers, dunning, webhooks, and plan breakdown in one call.",
        auth: "jwt",
        exampleResponse: envelope({
          metrics: { mrr: 4250000, arr: 51000000, churnRate: 3.2 },
          payments: {
            totalPayments: 321,
            succeededPayments: 302,
            failedPayments: 19,
            successRate: 94,
            recoveryRate: 61,
          },
          customers: {
            totalCustomers: 271,
            newCustomersLast30Days: 18,
            customersWithActiveSubscriptions: 284,
            averageRevenuePerCustomer: 14964,
            topCustomers: [
              {
                customerId: "c1u2s3t4-d5e6-7890-cust-123456789abc",
                customerName: "Chidi Nwosu",
                customerEmail: "chidi@example.com",
                totalRevenue: 180000,
                paymentCount: 12,
                activeSubscriptions: 1,
              },
            ],
          },
          dunning: {
            pastDueSubscriptions: 7,
            gracePeriodSubscriptions: 4,
            subscriptionsInDunning: 11,
            averageDunningAttempts: 1.8,
            maxDunningAttempts: 3,
            recoveredAfterDunning: 22,
            cancelledAfterDunning: 6,
          },
          webhooks: {
            totalDeliveries: 1204,
            deliveredCount: 1178,
            failedCount: 26,
            pendingCount: 0,
            successRate: 97.8,
          },
          planBreakdown: [
            {
              planId: "p1l2a3n4-d5e6-7890-plan-123456789abc",
              planName: "Pro Plan",
              amount: 15000,
              currency: "NGN",
              interval: "monthly",
              activeSubscriptions: 190,
              trialingSubscriptions: 8,
              mrr: 2850000,
              mrrSharePercent: 67.1,
            },
          ],
        }),
      },
      {
        method: "GET",
        path: "/analytics/revenue-trend",
        description: "Get revenue over time, bucketed by day, week, or month.",
        auth: "jwt",
        queryParams: [
          {
            field: "from",
            type: "string",
            description: "ISO 8601 date. Defaults to 30 days ago.",
          },
          {
            field: "to",
            type: "string",
            description: "ISO 8601 date. Defaults to today.",
          },
          {
            field: "granularity",
            type: "enum",
            description: "day | week | month. Default: day",
          },
        ],
        exampleResponse: envelope([
          { date: "2026-07-01", revenue: 142000, paymentCount: 9 },
          { date: "2026-07-02", revenue: 165000, paymentCount: 11 },
        ]),
      },
      {
        method: "GET",
        path: "/analytics/subscriptions/trend",
        description:
          "Get new vs. cancelled subscription counts over time, bucketed by day, week, or month.",
        auth: "jwt",
        queryParams: [
          { field: "from", type: "string" },
          { field: "to", type: "string" },
          {
            field: "granularity",
            type: "enum",
            description: "day | week | month",
          },
        ],
        exampleResponse: envelope([
          {
            date: "2026-07-01",
            newSubscriptions: 6,
            cancelledSubscriptions: 1,
            netChange: 5,
          },
        ]),
      },
      {
        method: "GET",
        path: "/analytics/plans",
        description: "Get revenue and subscriber counts broken down per plan.",
        auth: "jwt",
        exampleResponse: envelope([
          {
            planId: "p1l2a3n4-d5e6-7890-plan-123456789abc",
            planName: "Pro Plan",
            amount: 15000,
            currency: "NGN",
            interval: "monthly",
            activeSubscriptions: 190,
            trialingSubscriptions: 8,
            mrr: 2850000,
            mrrSharePercent: 67.1,
          },
        ]),
      },
      {
        method: "GET",
        path: "/analytics/payments",
        description:
          "Get payment funnel performance: success rate, recovery rate, and attempt volume.",
        auth: "jwt",
        exampleResponse: envelope({
          totalPayments: 321,
          succeededPayments: 302,
          failedPayments: 19,
          pendingPayments: 0,
          refundedPayments: 2,
          successRate: 94,
          recoveryRate: 61,
          totalRevenue: 128400000,
          revenueLast30Days: 4250000,
          averagePaymentAmount: 15230,
          totalAttempts: 340,
          failedAttempts: 38,
        }),
      },
      {
        method: "GET",
        path: "/analytics/customers",
        description:
          "Get customer growth metrics and the top customers by revenue.",
        auth: "jwt",
        exampleResponse: envelope({
          totalCustomers: 271,
          newCustomersLast30Days: 18,
          customersWithActiveSubscriptions: 284,
          averageRevenuePerCustomer: 14964,
          topCustomers: [
            {
              customerId: "c1u2s3t4-d5e6-7890-cust-123456789abc",
              customerName: "Chidi Nwosu",
              customerEmail: "chidi@example.com",
              totalRevenue: 180000,
              paymentCount: 12,
              activeSubscriptions: 1,
            },
          ],
        }),
      },
      {
        method: "GET",
        path: "/analytics/dunning",
        description:
          "Get past-due and grace-period volume and recovery performance for failed payments.",
        auth: "jwt",
        exampleResponse: envelope({
          pastDueSubscriptions: 7,
          gracePeriodSubscriptions: 4,
          subscriptionsInDunning: 11,
          averageDunningAttempts: 1.8,
          maxDunningAttempts: 3,
          recoveredAfterDunning: 22,
          cancelledAfterDunning: 6,
        }),
      },
      {
        method: "GET",
        path: "/analytics/webhooks",
        description:
          "Get webhook delivery success rate across all registered endpoints.",
        auth: "jwt",
        exampleResponse: envelope({
          totalDeliveries: 1204,
          deliveredCount: 1178,
          failedCount: 26,
          pendingCount: 0,
          successRate: 97.8,
        }),
      },
      {
        method: "GET",
        path: "/analytics/activity",
        description:
          "Get a paginated feed of recent domain events, sourced directly from the event store.",
        auth: "jwt",
        queryParams: [
          { field: "page", type: "number", description: "Default: 1" },
          {
            field: "limit",
            type: "number",
            description: "Default: 20, max: 100",
          },
        ],
        exampleResponse: envelope({
          data: [
            {
              id: "e1v2e3n4-d5e6-7890-evnt-123456789abc",
              eventType: "payment.recovered",
              aggregateType: "subscription",
              aggregateId: "s1u2b3s4-d5e6-7890-subs-123456789abc",
              payload: { amount: 15000, recoveredVia: "retry" },
              createdAt: "2026-07-15T09:12:00.000Z",
            },
          ],
          total: 1,
        }),
      },
    ],
  },
  {
    tag: "Audit",
    slug: "audit",
    description:
      "Read-only log of material workspace actions for the current merchant: plan changes, API key rotation, webhook configuration, subscription overrides, and auth events.",
    endpoints: [
      {
        method: "GET",
        path: "/audit/logs",
        description:
          "List audit log entries for the current merchant, most recent first.",
        auth: "jwt",
        queryParams: [
          { field: "page", type: "number", description: "Default: 1" },
          {
            field: "limit",
            type: "number",
            description: "Default: 20, max: 100",
          },
        ],
        exampleResponse: envelope({
          data: [
            {
              id: "a1u2d3i4-d5e6-7890-audi-123456789abc",
              merchantId: "m1e2r3c4-h5a6-7890-merc-hant12345678",
              actor: "founder@acme.ng",
              action: "update",
              resourceType: "plan",
              resourceId: "p1l2a3n4-d5e6-7890-plan-123456789abc",
              metadata: { amount: { from: 15000, to: 18000 } },
              timestamp: "2026-07-15T09:12:00.000Z",
            },
          ],
          total: 1,
        }),
      },
    ],
  },
  {
    tag: "Service info",
    slug: "service-info",
    description:
      "Diagnostics for the inbound Monnify webhook leg: what URL to hand Monnify, whether a webhook secret is configured, and the raw request log for debugging a delivery that never showed up.",
    endpoints: [
      {
        method: "GET",
        path: "/service-info",
        description:
          "A snapshot of this service's runtime info and Monnify webhook configuration.",
        auth: "jwt",
        exampleResponse: envelope({
          serviceName: "Subflow",
          environment: "production",
          serverTime: "2026-08-14T11:02:33.000Z",
          nodeVersion: "v20.14.0",
          monnifyWebhookUrl:
            "https://subscription-billing-engine-t7ss.onrender.com/webhooks/monnify",
          webhookSecretConfigured: true,
          monnifyApiUrl: "https://api.monnify.com",
        }),
      },
      {
        method: "GET",
        path: "/service-info/requests",
        description:
          "Paginated log of the most recent incoming requests this service has received, capped at 500.",
        auth: "jwt",
        queryParams: [
          { field: "page", type: "number", description: "Default: 1" },
          {
            field: "limit",
            type: "number",
            description: "Default: 20, max: 100",
          },
          {
            field: "category",
            type: "string",
            description: "Filter by request category, e.g. monnify-webhook",
          },
        ],
        exampleResponse: envelope({
          data: [
            {
              category: "monnify-webhook",
              method: "POST",
              path: "/webhooks/monnify",
              ipAddress: "34.201.22.10",
              statusCode: 200,
              monnifyTimestamp: "2026-08-14T11:02:30.000Z",
            },
          ],
          total: 1,
        }),
      },
      {
        method: "POST",
        path: "/service-info/echo",
        description:
          "Unauthenticated connectivity check. Echoes request metadata back so you can confirm a request from a given network path actually reaches this service.",
        auth: "public",
        exampleResponse: envelope({
          received: true,
          method: "POST",
          path: "/service-info/echo",
          timestamp: "2026-08-14T11:02:33.000Z",
        }),
      },
    ],
  },
  {
    tag: "Mission control",
    slug: "mission-control",
    description:
      "The REST half of the live event feed. The same events are also broadcast over a per-merchant Socket.IO namespace at /mission-control.",
    endpoints: [
      {
        method: "GET",
        path: "/events",
        description:
          "Paginated timeline of domain events for the current merchant, most recent first.",
        auth: "jwt",
        queryParams: [
          { field: "page", type: "number", description: "Default: 1" },
          {
            field: "limit",
            type: "number",
            description: "Default: 20, max: 100",
          },
        ],
        exampleResponse: envelope({
          data: [
            {
              id: "e1v2e3n4-t5i6-7890-evnt-123456789abc",
              eventType: "PaymentFailedEvent",
              aggregateType: "Subscription",
              aggregateId: "s1u2b3s4-d5e6-7890-subs-123456789abc",
              createdAt: "2026-08-14T11:02:33.000Z",
            },
          ],
          total: 1,
        }),
      },
      {
        method: "GET",
        path: "/events/:id",
        description:
          "A single timeline event by id, including its full payload.",
        auth: "jwt",
        exampleResponse: envelope({
          id: "e1v2e3n4-t5i6-7890-evnt-123456789abc",
          eventType: "PaymentFailedEvent",
          aggregateType: "Subscription",
          aggregateId: "s1u2b3s4-d5e6-7890-subs-123456789abc",
          payload: { failureReason: "card_declined" },
          createdAt: "2026-08-14T11:02:33.000Z",
        }),
      },
    ],
  },
  {
    tag: "Recovery channels",
    slug: "recovery-channels",
    description:
      "Public, non-JSON endpoints that redeem a single-use recovery link or accept an inbound recovery interaction. These deliberately bypass the standard envelope, an HTML page and a plain-text USSD response aren't meant for a JSON client.",
    endpoints: [
      {
        method: "GET",
        path: "/recovery/email",
        description:
          "Redeems a single-use retry, pause, or cancel link and returns a minimal HTML confirmation page, not JSON.",
        auth: "public",
        queryParams: [
          {
            field: "token",
            type: "string",
            description: "The single-use token from a recovery link, required",
          },
        ],
        exampleResponse: `<!doctype html>
<html>
  <body>
    <h1>Payment retried successfully</h1>
    <p>Your subscription is active again.</p>
  </body>
</html>`,
        responseLanguage: "html",
      },
      {
        method: "POST",
        path: "/ussd/session",
        description:
          "USSD aggregator session endpoint. Simulated only today, no telco is actually wired up. Returns plain text in the CON/END format a USSD gateway expects, not JSON.",
        auth: "public",
        requestSchema: [
          { field: "sessionId", type: "string", required: true },
          { field: "phoneNumber", type: "string", required: true },
          {
            field: "text",
            type: "string",
            description: "Accumulated menu input for this session",
          },
        ],
        exampleResponse: `CON Welcome to Subflow
1. Check status
2. Pause subscription
3. Cancel subscription`,
        responseLanguage: "text",
      },
      {
        method: "POST",
        path: "/webhooks/whatsapp",
        description:
          "Inbound receiver for a WhatsApp recovery button tap. Accepts a simplified payload shape, not Twilio's real form-encoded webhook body.",
        auth: "public",
        requestSchema: [
          {
            field: "from",
            type: "string",
            required: true,
            description: "The subscriber's phone number",
          },
          {
            field: "action",
            type: "string",
            required: true,
            description: "retry | pause | cancel",
          },
        ],
        exampleResponse: envelope({ received: true }),
      },
    ],
  },
];

export const webhookEvents = [
  {
    type: "subscription.created",
    description: "Fired when a new subscription is created.",
    payload: {
      id: "evt_001",
      type: "subscription.created",
      data: {
        subscription: {
          id: "s1u2b3s4-d5e6-7890-subs-123456789abc",
          status: "pending",
        },
        customer: {
          id: "c1u2s3t4-d5e6-7890-cust-123456789abc",
          name: "Chidi Nwosu",
        },
        plan: { id: "p1l2a3n4-d5e6-7890-plan-123456789abc", name: "Pro Plan" },
        invoiceId: "i1n2v3o4-d5e6-7890-inv1-234567890abc",
      },
      createdAt: "2026-07-01T10:00:00.000Z",
    },
  },
  {
    type: "subscription.updated",
    description: "Fired on a plan change, pause, or resume.",
    payload: {
      id: "evt_002",
      type: "subscription.updated",
      data: {
        subscription: {
          id: "s1u2b3s4-d5e6-7890-subs-123456789abc",
          status: "active",
        },
      },
      createdAt: "2026-07-10T08:00:00.000Z",
    },
  },
  {
    type: "subscription.renewed",
    description: "Fired when a subscription successfully renews.",
    payload: {
      id: "evt_003",
      type: "subscription.renewed",
      data: {
        subscription: {
          id: "s1u2b3s4-d5e6-7890-subs-123456789abc",
          status: "active",
        },
        invoice: {
          id: "i1n2v3o4-d5e6-7890-inv1-234567890abc",
          total: "15000.00",
        },
      },
      createdAt: "2026-08-01T00:05:00.000Z",
    },
  },
  {
    type: "payment.failed",
    description: "Fired when a payment attempt fails.",
    payload: {
      id: "evt_004",
      type: "payment.failed",
      data: {
        payment: {
          id: "9a1b2c3d-e4f5-6789-paym-123456789abc",
          status: "failed",
          failureReason: "Insufficient funds",
        },
        invoice: {
          id: "i1n2v3o4-d5e6-7890-inv1-234567890abc",
          status: "failed",
        },
      },
      createdAt: "2026-08-01T00:10:00.000Z",
    },
  },
  {
    type: "payment.recovered",
    description: "Fired when a previously failed payment succeeds.",
    payload: {
      id: "evt_005",
      type: "payment.recovered",
      data: {
        payment: {
          id: "9a1b2c3d-e4f5-6789-paym-123456789abc",
          status: "succeeded",
        },
        invoice: { id: "i1n2v3o4-d5e6-7890-inv1-234567890abc", status: "paid" },
      },
      createdAt: "2026-08-03T14:00:00.000Z",
    },
  },
  {
    type: "invoice.paid",
    description: "Fired when an invoice is marked as paid.",
    payload: {
      id: "evt_006",
      type: "invoice.paid",
      data: {
        invoice: {
          id: "i1n2v3o4-d5e6-7890-inv1-234567890abc",
          status: "paid",
          total: "15000.00",
        },
        payment: {
          id: "9a1b2c3d-e4f5-6789-paym-123456789abc",
          monnifyTransactionId: "TXN-MONNIFY-001234",
        },
        subscription: {
          id: "s1u2b3s4-d5e6-7890-subs-123456789abc",
          status: "active",
        },
      },
      createdAt: "2026-07-01T10:30:00.000Z",
    },
  },
  {
    type: "subscription.cancelled",
    description: "Fired when a subscription is cancelled.",
    payload: {
      id: "evt_007",
      type: "subscription.cancelled",
      data: {
        subscription: {
          id: "s1u2b3s4-d5e6-7890-subs-123456789abc",
          status: "cancelled",
          cancelledAt: "2026-07-20T12:00:00.000Z",
        },
      },
      createdAt: "2026-07-20T12:00:00.000Z",
    },
  },
];

export const subscriptionStatuses = [
  "pending",
  "trialing",
  "active",
  "past_due",
  "grace_period",
  "suspended",
  "cancelled",
  "expired",
] as const;
