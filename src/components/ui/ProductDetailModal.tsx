import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCartStore } from '@/lib/store';
import type { Product, ProductCategory } from '@/types';
import {
  Check,
  Code2,
  CreditCard,
  Download,
  ExternalLink,
  Palette,
  Rocket,
  Sparkles,
  Star,
} from 'lucide-react';
import React from 'react';
import { ProductCard } from './ProductCard';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  recommendedProducts?: Product[];
  onProductClick?: (product: Product) => void;
}

const categoryIcons: { [key in ProductCategory]: React.ReactNode } = {
  saas_starter: <Rocket className="w-5 h-5" />,
  prompt: <Sparkles className="w-5 h-5" />,
  ui_kit: <Palette className="w-5 h-5" />,
  cursor_rule: <Code2 className="w-5 h-5" />
};

const categoryLabels: { [key in ProductCategory]: string } = {
  saas_starter: 'SaaS Starter',
  prompt: 'AI Prompt',
  ui_kit: 'UI Kit',
  cursor_rule: 'Cursor Rule'
};

export const ProductDetailModal = ({
  isOpen,
  onClose,
  product,
  recommendedProducts = [],
  onProductClick
}: ProductDetailModalProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current && product) {
      scrollRef.current.scrollTop = 0;
    }
  }, [product, isOpen]);

  if (!product) return null;

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const handleAddToCart = () => {
    addItem(product);
    onClose();
  };

  const handleCheckout = () => {
    if (product.lemon_squeezy_variant_id) {
        window.open(`https://store.lemonsqueezy.com/checkout/buy/${product.lemon_squeezy_variant_id}?embed=1`, '_blank');
    } else {
        alert("Redirecting to secure checkout...");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-zinc-900 border-zinc-800 rounded-2xl shadow-2xl h-[90vh] flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>{product.description}</DialogDescription>
        </DialogHeader>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left - Image */}
            <div className="relative aspect-square lg:aspect-auto lg:h-full min-h-[400px]">
              <img
                src={product.image_url || 'https://via.placeholder.com/600'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent lg:hidden" />
            </div>

            {/* Right - Details */}
            <div className="p-6 lg:p-10">
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-6">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/10 text-purple-400 text-sm font-semibold border border-purple-500/20">
                  {categoryIcons[product.category]}
                  {categoryLabels[product.category]}
                </span>
                {product.is_featured && (
                  <span className="px-3 py-1 rounded-full bg-yellow-400 text-zinc-950 text-xs font-black uppercase tracking-wider">
                    Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tight">
                {product.name}
              </h2>

              {/* Stats */}
              <div className="flex items-center gap-5 mb-6 text-sm text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-zinc-200 font-bold">{product.rating_average.toFixed(1)}</span>
                  <span className="text-zinc-500">({product.rating_count} reviews)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-zinc-500" />
                  <span className="text-zinc-200 font-bold">{product.downloads_count}</span>
                  <span className="text-zinc-500">downloads</span>
                </span>
              </div>

              {/* Description */}
              <div className="prose prose-invert prose-sm max-w-none mb-8">
                <p className="text-zinc-400 text-base leading-relaxed">
                  {product.long_description || product.description}
                </p>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">What's Included</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-zinc-400">
                        <div className="mt-1 bg-green-500/10 p-0.5 rounded">
                          <Check className="w-3 h-3 text-green-500 shrink-0" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack */}
              {product.tech_stack && product.tech_stack.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">Built With</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800/50 text-zinc-300 text-xs font-medium border border-zinc-700/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Demo Link */}
              {product.demo_url && (
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full mb-8 border-zinc-700 bg-zinc-800/30 hover:bg-zinc-800 hover:text-white"
                >
                  <a
                    href={product.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Preview Live Demo
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Recommended Products */}
          {recommendedProducts.length > 0 && (
            <div className="p-6 lg:p-10 border-t border-zinc-800 bg-zinc-950/20">
               <h3 className="text-2xl font-black text-white mb-8">Related Products</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {recommendedProducts.map((p) => (
                   <ProductCard 
                     key={p.id} 
                     product={p} 
                     onViewDetails={onProductClick}
                   />
                 ))}
               </div>
            </div>
          )}
        </div>

        {/* Footer - Price & CTA */}
        <DialogFooter className="flex-row items-center justify-between p-6 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/50">
          <div className="text-left">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {formatPrice(product.price_cents)}
              </span>
              {product.compare_price_cents && product.compare_price_cents > product.price_cents && (
                <span className="text-lg text-zinc-500 line-through decoration-red-500/50">
                  {formatPrice(product.compare_price_cents)}
                </span>
              )}
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Ownership for life</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={handleAddToCart}
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold h-12 px-6"
            >
              Add to Cart
            </Button>
            <Button
                onClick={handleCheckout}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-black h-12 px-8 shadow-xl shadow-purple-600/20"
            >
                <CreditCard className="w-5 h-5 mr-2" />
                Get Instant Access
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
