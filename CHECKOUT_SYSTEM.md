# 🛒 Checkout System — Complete Step-by-Step Guide

> **Who is this for?** Someone who has never set up Stripe payments or Supabase before. Every single step has a command or screenshot description. Nothing is assumed.

---

## 📋 Table of Contents

1. [What's Already Built](#1-whats-already-built)
2. [Prerequisites — Install Required Tools](#2-prerequisites--install-required-tools)
3. [Create a Stripe Account](#3-create-a-stripe-account)
4. [Get Your Stripe API Keys](#4-get-your-stripe-api-keys)
5. [Add Stripe Keys to Your Project](#5-add-stripe-keys-to-your-project)
6. [Set Up the Database Schema](#6-set-up-the-database-schema)
7. [Install the Supabase CLI](#7-install-the-supabase-cli)
8. [Create the Checkout Session Edge Function](#8-create-the-checkout-session-edge-function)
9. [Create the Webhook Edge Function](#9-create-the-webhook-edge-function)
10. [Deploy the Edge Functions to Supabase](#10-deploy-the-edge-functions-to-supabase)
11. [Configure the Stripe Webhook](#11-configure-the-stripe-webhook)
12. [Test the Full Checkout Flow Locally](#12-test-the-full-checkout-flow-locally)
13. [Go Live — Switch to Production Keys](#13-go-live--switch-to-production-keys)
14. [Understanding the Cart System](#14-understanding-the-cart-system)
15. [Security Checklist](#15-security-checklist)
16. [Troubleshooting](#16-troubleshooting)

---

## 1. What's Already Built

The following code is **already written and working** in this project. You do NOT need to create these files:

| File                               | What it does                                         |
| ---------------------------------- | ---------------------------------------------------- |
| `src/lib/cart-store.ts`            | Manages the shopping cart (add/remove/persist items) |
| `src/lib/stripe.ts`                | Handles redirect to Stripe Checkout                  |
| `src/components/ui/CartModal.tsx`  | The slide-out cart drawer                            |
| `src/components/ui/CartButton.tsx` | The cart icon in the header                          |
| `src/pages/Checkout.tsx`           | The checkout summary page                            |
| `schema-checkout.sql`              | Database tables for orders, licenses                 |

**What you need to do:** Connect Stripe and Supabase so real payments work.

---

## 2. Prerequisites — Install Required Tools

Before starting, make sure these are installed on your computer.

### Step 2.1 — Check if Node.js is installed

Open a terminal (on Windows: press `Win + R`, type `cmd`, press Enter) and run:

```bash
node --version
```

You should see something like `v18.x.x` or higher. If you see an error, download Node.js from:
👉 https://nodejs.org/en/download (click the "LTS" button and run the installer)

### Step 2.2 — Check if npm is installed

```bash
npm --version
```

You should see `9.x.x` or higher. npm comes bundled with Node.js automatically.

### Step 2.3 — Verify the project dependencies are installed

Navigate to your project folder in the terminal, then run:

```bash
# On Windows, navigate to the project first:
cd "C:\Users\xxIde\OneDrive\Desktop\Workspaces\i-devr-code-llc-famousai-site"

# Install all packages (this may take 1-2 minutes):
npm install
```

You should see a `node_modules` folder created in your project directory.

### Step 2.4 — Verify Stripe SDK is installed

```bash
# Check that @stripe/stripe-js is already listed:
npm list @stripe/stripe-js
```

If you see `@stripe/stripe-js@X.X.X`, you're good. If not, install it:

```bash
npm install @stripe/stripe-js
```

---

## 3. Create a Stripe Account

> **Stripe** is the payment processor. It handles all credit card charging securely — you never touch card numbers directly.

### Step 3.1 — Sign up for Stripe

1. Go to **https://dashboard.stripe.com/register**
2. Enter your **email address**, **full name**, and choose a **password**
3. Click **"Create account"**
4. Check your email inbox for a verification email from Stripe
5. Click the verification link in that email

### Step 3.2 — Verify your identity (for receiving payouts)

1. After logging in, Stripe will ask you to activate your account
2. Click **"Activate account"** in the top bar
3. Fill in:
   - Country: United States (or your country)
   - Business type: Individual (if it's just you)
   - Legal name, address, phone number, date of birth
   - Bank account details (for receiving your money)
4. Click **"Submit"**

> ⚠️ **Note:** You can use **Test Mode** (fake money) without completing verification. But you MUST complete verification before accepting real payments. A yellow "Test mode" banner appears at the top when you're in test mode.

---

## 4. Get Your Stripe API Keys

You need two keys: a **Publishable Key** (safe to put in your frontend) and a **Secret Key** (NEVER put in your frontend).

### Step 4.1 — Open the Stripe Dashboard

1. Go to **https://dashboard.stripe.com**
2. Make sure you see **"Test mode"** in the top right toggle (it should be orange/yellow). This means you're using fake test keys — safe for development.

### Step 4.2 — Navigate to API Keys

1. In the left sidebar, click **"Developers"**
2. Click **"API keys"**

### Step 4.3 — Copy your keys

You will see two keys:

- **Publishable key** — starts with `pk_test_` → This goes in your `.env` file as `VITE_STRIPE_PUBLISHABLE_KEY`
- **Secret key** — starts with `sk_test_` → This goes into **Supabase secrets only**, NEVER in your frontend `.env`

Click the copy icon next to each key and save them somewhere safe temporarily (like Notepad).

---

## 5. Add Stripe Keys to Your Project

### Step 5.1 — Find your `.env` file

Your project already has a `.env` file at:

```
C:\Users\xxIde\OneDrive\Desktop\Workspaces\i-devr-code-llc-famousai-site\.env
```

Open it in VS Code. It currently looks something like:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### Step 5.2 — Replace the Stripe placeholder

Replace `pk_test_your_stripe_publishable_key_here` with your actual publishable key from Step 4.3:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123...your_actual_key_here
```

> ⚠️ **Never commit your `.env` file to GitHub.** The `.gitignore` already excludes it for you — check that `.env` appears in `.gitignore`.

### Step 5.3 — Restart your dev server

After changing `.env`, you MUST restart the dev server for the changes to take effect:

1. In your terminal, press `Ctrl + C` to stop the running server
2. Run it again:

```bash
npm run dev
```

You should see the dev server start at `http://localhost:5173` (or similar port).

---

## 6. Set Up the Database Schema

Your Supabase database needs new tables to store orders and licenses.

### Step 6.1 — Open Supabase SQL Editor

1. Go to **https://supabase.com/dashboard**
2. Log in and click on your project
3. In the left sidebar, click **"SQL Editor"**
4. Click **"New query"** (the `+` button)

### Step 6.2 — Run the checkout schema

1. Open the file `schema-checkout.sql` in your project (it's in the root folder)
2. Select ALL the text in that file (`Ctrl + A`)
3. Copy it (`Ctrl + C`)
4. Paste it into the Supabase SQL Editor (`Ctrl + V`)
5. Click the **"Run"** button (or press `Ctrl + Enter`)

You should see a success message. This creates the following tables:

- `orders` — stores each customer's purchase
- `order_items` — the individual products in each order
- `licenses` — the license keys generated after payment

### Step 6.3 — Verify tables were created

1. In the left sidebar, click **"Table Editor"**
2. You should now see `orders`, `order_items`, and `licenses` in the list
3. If you don't see them, go back to the SQL Editor and run the schema again

---

## 7. Install the Supabase CLI

The Supabase CLI lets you deploy Edge Functions (serverless backend code that runs on Supabase's servers).

### Step 7.1 — Install the Supabase CLI via npm

In your terminal (make sure you're in your project directory):

```bash
npm install -g supabase
```

### Step 7.2 — Verify the installation

```bash
supabase --version
```

You should see a version number like `1.x.x`. If you see an error, try:

```bash
npx supabase --version
```

> **Windows Note:** If you get a "not recognized" error, close and reopen your terminal. If it still fails, use `npx supabase` instead of `supabase` in all commands below.

### Step 7.3 — Log into Supabase CLI

```bash
supabase login
```

This will open a browser window asking you to log in to Supabase. Log in and approve the CLI access. Your terminal will show:

```
Finished supabase login.
```

### Step 7.4 — Link your project

You need your Supabase **Project Reference ID**. Find it:

1. Go to https://supabase.com/dashboard → Your project
2. Click **"Project Settings"** (gear icon at bottom left)
3. Click **"General"**
4. Copy the **"Reference ID"** — it looks like `abcdefghijklmnop`

Now run (replace `your-project-ref` with your actual ref):

```bash
supabase link --project-ref your-project-ref
```

When prompted for a database password, enter the password you chose when creating the Supabase project.

---

## 8. Create the Checkout Session Edge Function

This is the backend code that creates a Stripe Checkout session when the user clicks "Pay".

### Step 8.1 — Create the Edge Function directory

In your terminal (in the project root):

```bash
# Create the functions directory structure
mkdir -p supabase\functions\create-checkout-session
```

### Step 8.2 — Create the Edge Function file

Create a new file at:

```
supabase/functions/create-checkout-session/index.ts
```

Paste in the following complete code:

```typescript
// supabase/functions/create-checkout-session/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Get the Stripe secret key from Supabase secrets
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

/**
 * Returns the price multiplier based on license type
 */
function getLicenseMultiplier(licenseType: string): number {
  switch (licenseType) {
    case "team":
      return 3;
    case "enterprise":
      return 10;
    default:
      return 1; // personal
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, customerEmail } = await req.json();

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ error: "No items in cart" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build Stripe line items from cart items
    const lineItems = items.map(
      (item: {
        product: {
          name: string;
          description: string;
          image_url: string;
          price_cents: number;
        };
        license_type: string;
        quantity: number;
      }) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${item.product.name} (${item.license_type.charAt(0).toUpperCase() + item.license_type.slice(1)} License)`,
            description: item.product.description,
            images: item.product.image_url ? [item.product.image_url] : [],
          },
          unit_amount:
            item.product.price_cents * getLicenseMultiplier(item.license_type),
        },
        quantity: item.quantity ?? 1,
      }),
    );

    // Determine the frontend origin for redirect URLs
    const origin = req.headers.get("origin") ?? "http://localhost:5173";

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        // Store cart items as JSON for webhook processing
        items: JSON.stringify(
          items.map((i: { product: { id: string }; license_type: string }) => ({
            product_id: i.product.id,
            license_type: i.license_type,
          })),
        ),
        customer_email: customerEmail ?? "",
      },
    });

    return new Response(JSON.stringify({ id: session.id, url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Checkout session error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
```

---

## 9. Create the Webhook Edge Function

When Stripe processes a payment, it sends a "webhook" (a notification) to your backend. This function handles that notification and creates the order + license in your database.

### Step 9.1 — Create the webhook function directory

```bash
mkdir -p supabase\functions\stripe-webhook
```

### Step 9.2 — Create the webhook function file

Create a new file at:

```
supabase/functions/stripe-webhook/index.ts
```

Paste in the following complete code:

```typescript
// supabase/functions/stripe-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Stripe with secret key
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

// Initialize Supabase with service role key (bypasses RLS for backend writes)
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

/**
 * Returns seats allowed based on license type
 */
function getLicenseSeats(licenseType: string): number {
  switch (licenseType) {
    case "team":
      return 10;
    case "enterprise":
      return 9999; // Unlimited represented as a large number
    default:
      return 1; // personal
  }
}

/**
 * Generates a unique license key in format IDEVR-XXXX-XXXX-XXXX-XXXX
 */
function generateLicenseKey(): string {
  const segment = () =>
    Math.random().toString(36).substring(2, 6).toUpperCase();
  return `IDEVR-${segment()}-${segment()}-${segment()}-${segment()}`;
}

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!signature) {
    return new Response("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Verify the webhook actually came from Stripe (not a fake request)
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // Only process successful checkout events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const customerEmail =
      session.customer_details?.email ?? session.metadata?.customer_email ?? "";
    const metadataItems = session.metadata?.items
      ? JSON.parse(session.metadata.items)
      : [];

    try {
      // 1. Create the order record
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          status: "completed",
          total_cents: session.amount_total ?? 0,
          currency: (session.currency ?? "usd").toUpperCase(),
          stripe_session_id: session.id,
          stripe_payment_intent_id:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : null,
          customer_email: customerEmail,
          customer_name: session.customer_details?.name ?? null,
        })
        .select()
        .single();

      if (orderError)
        throw new Error(`Order insert failed: ${orderError.message}`);

      // 2. Create order items and licenses for each product purchased
      for (const item of metadataItems) {
        // Create order item
        const { error: itemError } = await supabase.from("order_items").insert({
          order_id: order.id,
          product_id: item.product_id,
          license_type: item.license_type,
          quantity: 1,
          // Price is stored in cents — retrieve from session if needed
          price_cents: Math.round(
            (session.amount_total ?? 0) / metadataItems.length,
          ),
        });

        if (itemError) {
          console.error("Order item insert error:", itemError);
          continue;
        }

        // Generate a unique license key
        const licenseKey = generateLicenseKey();

        // Create the license
        const { error: licenseError } = await supabase.from("licenses").insert({
          product_id: item.product_id,
          license_key: licenseKey,
          license_type: item.license_type,
          seats_allowed: getLicenseSeats(item.license_type),
          seats_used: 0,
          is_active: true,
        });

        if (licenseError) {
          console.error("License insert error:", licenseError);
        }
      }

      console.log(
        `✅ Order ${order.id} created successfully for ${customerEmail}`,
      );
    } catch (processingError) {
      console.error("Order processing error:", processingError);
      // Return 500 so Stripe retries the webhook
      return new Response("Processing failed", { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

---

## 10. Deploy the Edge Functions to Supabase

### Step 10.1 — Set your Stripe Secret Key as a Supabase secret

> ⚠️ This is NOT added to `.env`. It goes directly into Supabase's encrypted secret storage.

```bash
# Replace sk_test_51ABC... with your actual secret key from Step 4.3
supabase secrets set STRIPE_SECRET_KEY=sk_test_51ABC123yourActualSecretKeyHere
```

You should see: `Finished supabase secrets set.`

### Step 10.2 — Deploy the create-checkout-session function

```bash
supabase functions deploy create-checkout-session
```

Wait for it to finish. You'll see output like:

```
Deploying create-checkout-session (script size: X bytes)
Done in X seconds.
```

### Step 10.3 — Deploy the stripe-webhook function

```bash
supabase functions deploy stripe-webhook
```

### Step 10.4 — Get your Edge Function URLs

After deploying, your function URLs follow this pattern:

```
https://YOUR-PROJECT-REF.supabase.co/functions/v1/create-checkout-session
https://YOUR-PROJECT-REF.supabase.co/functions/v1/stripe-webhook
```

Replace `YOUR-PROJECT-REF` with your actual Supabase reference ID from Step 7.4.

Write down the **stripe-webhook URL** — you'll need it in the next step.

### Step 10.5 — Update your frontend to call the Edge Function

The frontend `src/lib/stripe.ts` currently calls `/api/create-checkout-session`. Update it to call the Supabase Edge Function URL instead.

Open `src/lib/stripe.ts` and find this line:

```typescript
const response = await fetch('/api/create-checkout-session', {
```

Replace it with your actual Edge Function URL:

```typescript
const response = await fetch(
  'https://YOUR-PROJECT-REF.supabase.co/functions/v1/create-checkout-session',
  {
```

> **Tip:** To avoid hardcoding URLs, add this to your `.env` file:
>
> ```env
> VITE_SUPABASE_FUNCTIONS_URL=https://YOUR-PROJECT-REF.supabase.co/functions/v1
> ```
>
> Then use `import.meta.env.VITE_SUPABASE_FUNCTIONS_URL + '/create-checkout-session'` in the code.

---

## 11. Configure the Stripe Webhook

Stripe needs to know WHERE to send payment notifications (to your Edge Function).

### Step 11.1 — Open Stripe Webhook settings

1. Go to **https://dashboard.stripe.com/test/webhooks**
2. Click **"Add endpoint"**

### Step 11.2 — Add your webhook URL

1. In the **"Endpoint URL"** field, paste your stripe-webhook Edge Function URL:
   ```
   https://YOUR-PROJECT-REF.supabase.co/functions/v1/stripe-webhook
   ```
2. Under **"Events to listen to"**, click **"Select events"**
3. Search for and select: **`checkout.session.completed`**
4. Click **"Add endpoint"**

### Step 11.3 — Copy the Webhook Signing Secret

1. After creating the endpoint, click on it in the list
2. You'll see a **"Signing secret"** section — click **"Reveal"**
3. Copy the secret — it starts with `whsec_`

### Step 11.4 — Add the Webhook Secret to Supabase

```bash
# Replace whsec_... with your actual webhook signing secret
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_yourWebhookSigningSecretHere
```

---

## 12. Test the Full Checkout Flow Locally

### Step 12.1 — Start your dev server (if not already running)

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

### Step 12.2 — Add a product to the cart

1. Browse the products on the homepage
2. Hover over a product card
3. Click the **shopping cart icon** that appears
4. You should see a green toast notification: "Added to cart!"

### Step 12.3 — Open the cart

1. Click the **cart icon** in the top navigation bar
2. A drawer slides out from the right showing your cart items
3. You can change the **License Type** (Personal / Team / Enterprise) — the price updates in real-time

### Step 12.4 — Proceed to checkout

1. Click **"Proceed to Checkout"** button in the cart
2. You'll be redirected to `/checkout`
3. Review the order summary on the right side
4. Fill in your **email** and **name**
5. Click **"Pay $XX.XX"**

### Step 12.5 — Complete the test payment

Stripe will redirect you to their hosted checkout page. Use these **test card numbers** (they're fake — no real money is charged):

| Card Number           | Expiry                         | CVV          | Result                |
| --------------------- | ------------------------------ | ------------ | --------------------- |
| `4242 4242 4242 4242` | Any future date (e.g. `12/28`) | Any 3 digits | ✅ Payment succeeds   |
| `4000 0000 0000 9995` | Any future date                | Any 3 digits | ❌ Payment declined   |
| `4000 0025 0000 3155` | Any future date                | Any 3 digits | 🔐 3D Secure required |

Enter the successful card number, fill in the other fields with anything, and click **"Pay"**.

### Step 12.6 — Verify the success page

After payment, Stripe redirects you to `/success?session_id=cs_test_...`

You should see a success confirmation.

### Step 12.7 — Verify the order in Supabase

1. Go to **https://supabase.com/dashboard** → Your project → **Table Editor**
2. Click the `orders` table — you should see a new row with `status = "completed"`
3. Click the `licenses` table — you should see a new license key like `IDEVR-XXXX-XXXX-XXXX-XXXX`

---

## 13. Go Live — Switch to Production Keys

> ⚠️ Only do this when you are **fully tested** and ready to accept real customer payments.

### Step 13.1 — Turn off Test Mode in Stripe

1. Go to **https://dashboard.stripe.com**
2. Toggle the **"Test mode"** switch in the top right to **OFF** (it turns gray)
3. You are now in **Live mode**

### Step 13.2 — Get live API keys

1. Go to **"Developers"** → **"API keys"**
2. Copy the **Publishable key** (starts with `pk_live_`)
3. Copy the **Secret key** (starts with `sk_live_`)

### Step 13.3 — Update your `.env` file

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51ABC...your_live_publishable_key
```

### Step 13.4 — Update Supabase secrets with live secret key

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_51ABC...your_live_secret_key
```

### Step 13.5 — Create a live webhook endpoint

Repeat Step 11 but in **live mode** (not test mode). The URL is the same, but you'll get a different `whsec_` signing secret.

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
```

### Step 13.6 — Redeploy Edge Functions

```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

### Step 13.7 — Build your app for production

```bash
npm run build
```

This creates a `dist/` folder with your optimized frontend. Deploy this folder to Vercel, Netlify, or any static host.

---

## 14. Understanding the Cart System

This section explains how the cart code works, in case you need to customize it.

### Adding Items to Cart (in your components)

```typescript
import { useCartStore } from "@/lib/cart-store";

const { addItem } = useCartStore();

// Add product with default personal license
addItem(product);

// Add product with a specific license type
addItem(product, "team"); // 3x price
addItem(product, "enterprise"); // 10x price
```

### Opening the Cart Programmatically

```typescript
const { openCart } = useCartStore();

// Call this to open the cart drawer from anywhere
openCart();
```

### Reading Cart State

```typescript
const {
  items, // Array of CartItem objects
  getTotalItems, // Function: returns total item count (number)
  getTotalPrice, // Function: returns total price in cents (number)
  clearCart, // Function: empties the entire cart
} = useCartStore();

// Example: display total
const totalDollars = (getTotalPrice() / 100).toFixed(2);
console.log(`Total: $${totalDollars}`);
```

### License Pricing Rules

Defined in `src/lib/cart-store.ts`:

| License    | Multiplier     | Seats     |
| ---------- | -------------- | --------- |
| Personal   | 1× base price  | 1 seat    |
| Team       | 3× base price  | 10 seats  |
| Enterprise | 10× base price | Unlimited |

To change pricing, edit the `getLicenseMultiplier` function in `src/lib/cart-store.ts`.

---

## 15. Security Checklist

Go through this list before going live:

- [ ] **`.env` is in `.gitignore`** — Run `git status` and confirm `.env` does NOT appear
- [ ] **Stripe secret key is ONLY in Supabase secrets** — Never in `.env` or source code
- [ ] **Webhook signature verification is active** — The `constructEventAsync` call in the webhook function handles this
- [ ] **RLS (Row Level Security) is enabled** — Already set up in `schema-checkout.sql`
- [ ] **HTTPS is enforced** — Vercel/Netlify do this automatically
- [ ] **Test with real test cards** before going live
- [ ] **Set up Stripe Radar** for fraud detection (free tier is available in Stripe dashboard → Radar)
- [ ] **Enable email receipts** in Stripe Dashboard → Settings → Emails

---

## 16. Troubleshooting

### ❌ "Stripe publishable key not found"

**Cause:** The `VITE_STRIPE_PUBLISHABLE_KEY` in your `.env` is missing or the dev server hasn't been restarted.

**Fix:**

1. Open `.env` and verify the key is there (starts with `pk_test_`)
2. Stop the dev server (`Ctrl + C`) and restart it: `npm run dev`

---

### ❌ "Failed to create checkout session" / Network error

**Cause:** The Edge Function URL is wrong or the function isn't deployed yet.

**Fix:**

1. Verify the function is deployed: `supabase functions list`
2. Double-check the URL in `src/lib/stripe.ts` — it must match your Supabase project ref

---

### ❌ Webhook shows "Invalid signature" in Supabase logs

**Cause:** The `STRIPE_WEBHOOK_SECRET` in Supabase secrets doesn't match the one in Stripe.

**Fix:**

1. Go to Stripe Dashboard → Webhooks → Your endpoint → Copy the signing secret
2. Run: `supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_correct_value_here`
3. Redeploy: `supabase functions deploy stripe-webhook`

---

### ❌ Orders not appearing in database after payment

**Cause:** The webhook isn't being received or is failing silently.

**Fix:**

1. Go to Stripe Dashboard → Webhooks → Your endpoint → Click on it
2. Look at the **"Recent deliveries"** tab for errors
3. Check Supabase Edge Function logs: Go to Supabase Dashboard → Edge Functions → `stripe-webhook` → Logs

---

### ❌ Cart items disappear on page refresh

**Cause:** This should NOT happen — the cart uses `localStorage` for persistence. If it does happen, clear your browser cache and check the browser console for errors.

---

### ❌ "supabase: command not found"

**Cause:** Supabase CLI isn't installed or not in PATH.

**Fix:**

```bash
# Use npx instead:
npx supabase login
npx supabase functions deploy create-checkout-session
npx supabase functions deploy stripe-webhook
```

---

## 📚 Reference Links

| Resource                     | URL                                        |
| ---------------------------- | ------------------------------------------ |
| Stripe Test Card Numbers     | https://stripe.com/docs/testing#cards      |
| Stripe Dashboard (Test)      | https://dashboard.stripe.com/test          |
| Stripe Webhooks Guide        | https://stripe.com/docs/webhooks           |
| Supabase Edge Functions Docs | https://supabase.com/docs/guides/functions |
| Supabase CLI Reference       | https://supabase.com/docs/reference/cli    |
| Supabase Dashboard           | https://supabase.com/dashboard             |

---

**Status:** ✅ Checkout system implemented — follow steps 3–11 to activate payments  
**Last Updated:** 2026-02-21
