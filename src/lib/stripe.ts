import type { CartItem } from '@/types';
import type { Stripe, StripeError } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Singleton pattern for Stripe instance
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get or initialize the Stripe instance
 * @throws {Error} If Stripe publishable key is not configured
 */
function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      throw new Error(
        'Stripe publishable key not found. Add VITE_STRIPE_PUBLISHABLE_KEY to your .env file.'
      );
    }
    
    stripePromise = loadStripe(publishableKey);
  }
  
  return stripePromise;
}

/**
 * API response type for checkout session creation
 */
interface CheckoutSessionResponse {
  id: string;
  url?: string;
}

/**
 * Create a Stripe Checkout session and redirect the user
 * @param items - Cart items to checkout
 * @param customerEmail - Optional customer email for pre-filling
 * @throws {Error} If checkout session creation fails
 */
export async function createCheckoutSession(
  items: CartItem[],
  customerEmail?: string
): Promise<void> {
  if (!items || items.length === 0) {
    throw new Error('Cart is empty. Add items before checking out.');
  }

  try {
    // Call backend API to create checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        customerEmail,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: 'Failed to create checkout session',
      }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const session: CheckoutSessionResponse = await response.json();

    if (!session.id) {
      throw new Error('Invalid checkout session response from server');
    }

    // Redirect to Stripe Checkout using the session URL
    // Modern Stripe integration uses direct URL redirect instead of redirectToCheckout
    if (session.url) {
      window.location.href = session.url;
    } else {
      throw new Error('Checkout session URL not provided by server. Please check your backend configuration.');
    }
  } catch (error) {
    // Re-throw with context
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during checkout');
  }
}

/**
 * Verify a checkout session (for success page)
 * @param sessionId - Stripe session ID from URL params
 * @returns Session verification data
 */
export async function verifyCheckoutSession(sessionId: string): Promise<{
  success: boolean;
  orderId?: string;
  error?: string;
}> {
  try {
    const response = await fetch(`/api/verify-checkout-session?session_id=${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: 'Failed to verify checkout session',
      };
    }

    const data = await response.json();
    return {
      success: true,
      orderId: data.orderId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Format Stripe error for user display
 * @param error - Stripe error object
 * @returns User-friendly error message
 */
export function formatStripeError(error: StripeError): string {
  switch (error.type) {
    case 'card_error':
      return error.message || 'Your card was declined. Please try a different payment method.';
    case 'validation_error':
      return 'Invalid payment information. Please check your details and try again.';
    case 'api_error':
      return 'Payment processing is temporarily unavailable. Please try again later.';
    case 'rate_limit_error':
      return 'Too many requests. Please wait a moment and try again.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Check if Stripe is properly configured
 * @returns True if Stripe publishable key is set
 */
export function isStripeConfigured(): boolean {
  return !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
}