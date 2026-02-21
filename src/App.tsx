
import { ThemeProvider } from "@/components/theme-provider";
import { CartModal } from "@/components/ui/CartModal";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
<<<<<<< HEAD
import Checkout from "./pages/Checkout";
=======
import { Analytics } from "@vercel/analytics/react";
>>>>>>> 6c4364f652fc64972a994e883f5aa19c66ab6952
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CartModal />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
