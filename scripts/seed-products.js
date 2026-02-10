// @ts-check
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Constants from .env
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: Please provide VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const products = [
  {
    name: 'Auto-Blogger AI',
    slug: 'auto-blogger-ai',
    description: 'An AI-powered blog post generator that creates SEO-optimized content in seconds.',
    long_description: 'Auto-Blogger AI leverages advanced language models to generate written content. It helps boost your productivity by automating the initial drafting process.',
    category: 'saas_starter',
    price_cents: 4900,
    compare_price_cents: 9900,
    features: ['SEO Optimizations', 'Multiple Tones', 'Auto-Formatting', 'Keyword Integration'],
    tech_stack: ['Next.js', 'OpenAI API', 'TailwindCSS'],
    is_featured: true,
    is_published: true,
    downloads_count: 1240,
    rating_average: 4.8,
    rating_count: 156,
    tags: ['ai', 'blogging', 'seo', 'automation'],
    image_url: 'https://images.unsplash.com/photo-1499750310159-5254f5338dd9?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'SaaS Startup Boilerplate',
    slug: 'saas-startup-boilerplate',
    description: 'Everything you need to ship your SaaS in days, not months. Includes auth, payments, and more.',
    long_description: 'Launch your next big idea with this comprehensive boilerplate. Pre-configured with Supabase, Stripe, and React best practices.',
    category: 'saas_starter',
    price_cents: 14900,
    compare_price_cents: 29900,
    features: ['Authentication', 'Stripe Integration', 'Database Schema', 'Admin Dashboard'],
    tech_stack: ['React', 'Supabase', 'Stripe', 'Node.js'],
    is_featured: true,
    is_published: true,
    downloads_count: 532,
    rating_average: 4.9,
    rating_count: 89,
    tags: ['saas', 'boilerplate', 'starter-kit', 'react'],
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Midjourney Prompt Master',
    slug: 'midjourney-prompt-master',
    description: 'A curated collection of 1000+ prompts to generate stunning AI art.',
    long_description: 'Unlock the full potential of Midjourney with these expert prompts. Perfect for artists, designers, and hobbyists looking for inspiration.',
    category: 'prompt',
    price_cents: 1900,
    features: ['1000+ Prompts', 'Categorized Lists', 'Example Images', 'Usage Guide'],
    tech_stack: ['Midjourney'],
    is_featured: false,
    is_published: true,
    downloads_count: 3421,
    rating_average: 4.7,
    rating_count: 412,
    tags: ['ai-art', 'midjourney', 'prompts', 'design'],
    image_url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'ChatGPT Code Expert',
    slug: 'chatgpt-code-expert',
    description: 'Debug, refactor, and write code 10x faster with these developer-focused prompts.',
    long_description: 'Turn ChatGPT into a senior engineer. These prompts are designed to elicit the best code explanations, bug fixes, and architectural advice.',
    category: 'prompt',
    price_cents: 2900,
    features: ['Code Refactoring', 'Bug Hunting', 'Documentation Generator', 'Unit Test Writer'],
    tech_stack: ['ChatGPT', 'OpenAI'],
    is_featured: true,
    is_published: true,
    downloads_count: 2105,
    rating_average: 4.9,
    rating_count: 231,
    tags: ['coding', 'chatgpt', 'developer-tools', 'productivity'],
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Modern Dashboard UI Kit',
    slug: 'modern-dashboard-ui-kit',
    description: 'Clean, responsive, and customizable dashboard components for React projects.',
    long_description: 'Build professional dashboards with ease. This kit includes charts, tables, cards, and navigation components designed with modern aesthetics.',
    category: 'ui_kit',
    price_cents: 5900,
    compare_price_cents: 8900,
    features: ['Responsive Layouts', 'Dark Mode Support', 'Customizable Themes', 'Accessibility Ready'],
    tech_stack: ['React', 'TailwindCSS', 'Framer Motion'],
    is_featured: false,
    is_published: true,
    downloads_count: 890,
    rating_average: 4.6,
    rating_count: 104,
    tags: ['ui-kit', 'dashboard', 'react', 'design-system'],
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'E-commerce UI Bundle',
    slug: 'ecommerce-ui-bundle',
    description: 'A complete set of high-converting UI components for online stores.',
    long_description: 'Optimize your sales funnel with these conversion-focused components. Includes product pages, cart drawers, checkout flows, and more.',
    category: 'ui_kit',
    price_cents: 6900,
    features: ['Product Cards', 'Cart Drawer', 'Checkout Flow', 'Mobile Optimized'],
    tech_stack: ['React', 'TailwindCSS'],
    is_featured: true,
    is_published: true,
    downloads_count: 1560,
    rating_average: 4.8,
    rating_count: 178,
    tags: ['ecommerce', 'ui-kit', 'conversion', 'shop'],
    image_url: 'https://images.unsplash.com/photo-1472851294608-415105363543?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Clean Code React Rules',
    slug: 'clean-code-react-rules',
    description: 'Enforce best practices and clean architecture in your React codebase automatically.',
    long_description: 'Stop reviewing bad code. These Cursor rules automatically suggest improvements and catch common react anti-patterns before they reach production.',
    category: 'cursor_rule',
    price_cents: 1900,
    features: ['Hook Rules', 'Component Structure', 'Performance Checks', 'Accessibility Audits'],
    tech_stack: ['Cursor', 'ESLint', 'React'],
    is_featured: false,
    is_published: true,
    downloads_count: 450,
    rating_average: 4.9,
    rating_count: 56,
    tags: ['cursor', 'ide', 'code-quality', 'react'],
    image_url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800' // Placeholder reuse
  },
    {
    name: 'TypeScript Strict Mode Rules',
    slug: 'typescript-strict-mode-rules',
    description: 'A comprehensive set of rules to make your TypeScript code bulletproof.',
    long_description: 'Leverage the full power of TypeScript. These rules help you avoid "any" types, ensure null checks, and write safer, more maintainable code.',
    category: 'cursor_rule',
    price_cents: 1500,
    features: ['Strict Typing', 'Null Safety', 'Interface Enforcement', 'Generic Constraints'],
    tech_stack: ['Cursor', 'TypeScript'],
    is_featured: true,
    is_published: true,
    downloads_count: 670,
    rating_average: 4.8,
    rating_count: 92,
    tags: ['cursor', 'typescript', 'safety', 'ide'],
    image_url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800'
  }
];

async function seed() {
  console.log('Starting seed...');

  for (const product of products) {
    const { data: existing, error: fetchError } = await supabase
      .from('products')
      .select('id')
      .eq('slug', product.slug)
      .maybeSingle();

    if (fetchError) {
      // If table doesn't exist, this error will be uniform.
      console.error(`Error checking product ${product.slug}:`, fetchError.message);
      // We can try to continue, but likely all will fail if table is missing.
      continue;
    }

    if (existing) {
      console.log(`Product ${product.slug} already exists, updating...`);
      const { error: updateError } = await supabase
        .from('products')
        .update({ ...product, updated_at: new Date().toISOString() })
        .eq('id', existing.id);

      if (updateError) {
        console.error(`Failed to update ${product.slug}:`, updateError.message);
      } else {
        console.log(`Updated ${product.slug}`);
      }
    } else {
      console.log(`Creating product ${product.slug}...`);
      const { error: insertError } = await supabase
        .from('products')
        .insert({ ...product, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });

      if (insertError) {
        console.error(`Failed to insert ${product.slug}:`, insertError.message);
      } else {
        console.log(`Created ${product.slug}`);
      }
    }
  }

  console.log('Seed completed.');
}

seed().catch(console.error);
