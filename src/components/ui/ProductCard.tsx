import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/lib/cart-store';
import { useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { Product, ProductCategory } from '@/types';
import { Code2, Download, Eye, Palette, Rocket, ShoppingCart, Sparkles, Star } from 'lucide-react';
import React from 'react';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

const categoryIcons: { [key in ProductCategory]: React.ReactNode } = {
  saas_starter: <Rocket className="w-4 h-4" />,
  prompt: <Sparkles className="w-4 h-4" />,
  ui_kit: <Palette className="w-4 h-4" />,
  cursor_rule: <Code2 className="w-4 h-4" />
};

const categoryColors: { [key in ProductCategory]: string } = {
  saas_starter: 'from-purple-500 to-pink-500',
  prompt: 'from-cyan-500 to-blue-500',
  ui_kit: 'from-green-500 to-emerald-500',
  cursor_rule: 'from-orange-500 to-yellow-500'
};

const categoryLabels: { [key in ProductCategory]: string } = {
  saas_starter: 'SaaS Starter',
  prompt: 'AI Prompt',
  ui_kit: 'UI Kit',
  cursor_rule: 'Cursor Rule'
};

export const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const { addItem } = useCartStore();
  const openModal = useUIStore((state) => state.openModal);
  const { toast } = useToast();

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.category === 'prompt' && product.preview_content) {
      openModal('prompt-runner', product);
    } else if (onViewDetails) {
      onViewDetails(product);
    }
  };

  return (
    <Card 
      onClick={() => onViewDetails?.(product)}
      className="group relative overflow-hidden bg-zinc-900/50 border-zinc-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer flex flex-col h-full"
    >
      {/* Image Area */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={product.image_url || 'https://via.placeholder.com/400x250'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
        
        {/* Category Badge */}
        <div className={cn(
          "absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r",
          categoryColors[product.category]
        )}>
          {categoryIcons[product.category]}
          <span>{categoryLabels[product.category]}</span>
        </div>

        {/* Featured Badge */}
        {product.is_featured && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-yellow-400 text-zinc-950 text-[10px] font-black uppercase tracking-wider shadow-lg">
            Featured
          </div>
        )}

        {/* Floating Quick Actions */}
        <div className="absolute bottom-3 right-3 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            variant="secondary"
            size="icon"
            onClick={handlePreview}
            className="h-9 w-9 bg-zinc-900/90 hover:bg-zinc-800 border-zinc-700/50"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            onClick={handleAddToCart}
            className="h-9 w-9 bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
            {product.name}
          </CardTitle>
          <div className="text-right shrink-0">
            <p className="font-bold text-lg text-white">
              {formatPrice(product.price_cents)}
            </p>
          </div>
        </div>
        <CardDescription className="text-zinc-400 text-xs line-clamp-2 mt-1">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-grow">
        <div className="flex flex-wrap gap-1.5 mt-2">
          {product.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-500 text-[10px] font-medium border border-zinc-700/30"
            >
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 border-t border-zinc-800/50 mt-auto bg-zinc-950/30">
        <div className="flex items-center justify-between w-full pt-3">
          <div className="flex items-center gap-4 text-[11px] text-zinc-500">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              {product.rating_average.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {product.downloads_count}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 p-0"
            onClick={() => onViewDetails?.(product)}
          >
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
