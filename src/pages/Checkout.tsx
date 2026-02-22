import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { formatPrice, getLicenseDetails } from '@/lib/cart-store';
import { useCartStore } from '@/lib/store';
import { ArrowLeft, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const totalPrice = getTotalPrice();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Please add items to your cart before checking out.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // In a real implementation, you would:
      // 1. Create a Stripe Checkout Session
      // 2. Redirect to Stripe's hosted checkout page
      // 3. Handle webhook for successful payment
      // 4. Generate license keys
      // 5. Send confirmation email

      // For now, we'll simulate the checkout process
      toast({
        title: 'Checkout initiated',
        description: 'Redirecting to payment processor...',
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: Replace with actual Stripe integration
      console.log('Checkout data:', {
        email,
        name,
        items: items.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          license_type: item.license_type,
          quantity: item.quantity,
          price_cents: item.product.price_cents * getLicenseDetails(item.license_type).multiplier,
        })),
        total_cents: totalPrice,
      });

      toast({
        title: 'Payment successful!',
        description: 'Your purchase is being processed. Check your email for license keys.',
      });

      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout failed',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShieldCheck className="w-16 h-16 text-zinc-700 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-zinc-400 mb-6">
              Add some products to your cart to proceed with checkout
            </p>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="mb-4 text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Button>
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-zinc-400">Complete your purchase securely</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <form onSubmit={handleCheckout} className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                      <p className="text-xs text-zinc-500 mt-1">
                        License keys will be sent to this email
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-zinc-800" />

                {/* Payment Method */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Payment Method
                  </h2>
                  <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <CreditCard className="w-6 h-6 text-purple-500" />
                      <div>
                        <p className="font-medium">Stripe Checkout</p>
                        <p className="text-sm text-zinc-400">
                          Secure payment processing
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500">
                      You'll be redirected to Stripe's secure checkout page to complete
                      your payment.
                    </p>
                  </div>
                </div>

                <Separator className="bg-zinc-800" />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                  size="lg"
                >
                  {loading ? (
                    'Processing...'
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Pay {formatPrice(totalPrice)}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-zinc-500">
                  By completing your purchase, you agree to our Terms of Service and
                  Privacy Policy
                </p>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900 border-zinc-800 p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const licenseDetails = getLicenseDetails(item.license_type);
                  const itemPrice =
                    item.product.price_cents * licenseDetails.multiplier;

                  return (
                    <div
                      key={`${item.product.id}-${item.license_type}`}
                      className="flex gap-3"
                    >
                      {item.product.image_url && (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.product.name}</h4>
                        <p className="text-sm text-zinc-400">{licenseDetails.label}</p>
                        <p className="text-sm font-semibold text-purple-400 mt-1">
                          {formatPrice(itemPrice)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator className="bg-zinc-800 mb-4" />

              {/* Pricing Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="text-white">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Tax</span>
                  <span className="text-white">$0.00</span>
                </div>
              </div>

              <Separator className="bg-zinc-800 mb-4" />

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-white">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {/* Security Badges */}
              <div className="bg-zinc-800 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span className="text-zinc-300">Secure SSL Encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span className="text-zinc-300">PCI DSS Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4 text-green-500" />
                  <span className="text-zinc-300">Powered by Stripe</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
