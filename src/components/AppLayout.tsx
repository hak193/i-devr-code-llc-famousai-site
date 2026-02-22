import { useUIStore } from '@/lib/store';
import type { Product } from '@/types';
import React, { useState } from 'react';

// Components
import { AuthModal } from '@/components/ui/AuthModal';
import { Footer } from '@/components/ui/Footer';
import { Header } from '@/components/ui/Header';
import { PromptPreviewModal } from '@/components/ui/PromptPreviewModal';

// Views
import { DashboardView } from '@/components/dashboard/DashboardView';
import { CategoryShowcase } from '@/components/store/CategoryShowcase';
import { FeaturedProducts } from '@/components/store/FeaturedProducts';
import { HeroSection } from '@/components/store/HeroSection';
import { ProductGrid } from '@/components/store/ProductGrid';
import { PromotionalHero } from '@/components/store/PromotionalHero';
import { WorkbenchView } from '@/components/workbench/WorkbenchView';

const AppLayout: React.FC = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const { activeView, modal, closeModal } = useUIStore();

  // Get the product for prompt preview modal
  const previewProduct = modal.type === 'prompt-runner' ? (modal.data as Product) : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <Header onOpenAuth={() => setAuthOpen(true)} />

      {/* Main Content */}
      <main>
        {activeView === 'store' && (
          <>
            <HeroSection />
            <CategoryShowcase />
            <PromotionalHero />
            <FeaturedProducts />
            <ProductGrid />
          </>
        )}

        {activeView === 'workbench' && <WorkbenchView />}

        {activeView === 'dashboard' && <DashboardView />}
      </main>

      {/* Footer - only show on store view */}
      {activeView === 'store' && <Footer />}

      {/* Modals & Drawers */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <PromptPreviewModal
        isOpen={modal.type === 'prompt-runner'}
        onClose={closeModal}
        product={previewProduct}
      />
    </div>
  );
};

export default AppLayout;
