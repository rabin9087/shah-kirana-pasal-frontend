/// <reference types="vite/client" />

import { Stripe } from "@stripe/stripe-js";


interface ImportMetaEnv {
  readonly VITE_DEV_API: string;
  readonly VITE_PROD_API: string;
  readonly STRIPE_KEY: Stripe;
  // Add other environment variables here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
