# i-DevR Code LLC - FamousAI Site

A modern, production-ready SaaS starter for selling digital products, featuring AI-powered tools, courses, and more. Built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Supabase**.

## 🚀 Key Features

*   **🛒 Digital Storefront**: Beautifully designed product grid with sorting, filtering, and live search.
*   **📦 Product Details**: Modal-based product previews with detailed specs, features, and image carousels.
*   **🔥 Admin Dashboard**: Manage your products, view revenue analytics, and control your store via `/admin`.
*   **⚡ Supabase Backend**: Real-time database for products, user authentication, and secure data handling.
*   **Responsive Design**: Fully responsive UI/UX across desktop, tablet, and mobile devices.
*   **Modern Stack**: Uses Shadcn/UI components, Lucide icons, and React Query for state management.

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), TypeScript
*   **Styling**: Tailwind CSS, Shadcn/UI
*   **Backend / Database**: Supabase (PostgreSQL)
*   **State Management**: Zustand, React Query
*   **Icons**: Lucide React
*   **Deployment**: Vercel (Recommended)

---

## 🏁 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [Supabase Account](https://supabase.com/) (Free tier works perfectly)
*   [Vercel Account](https://vercel.com/) (For deployment)

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/hak193/i-devr-code-llc-famousai-site
cd i-devr-code-llc-famousai-site
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_for_seeding_only
```

> **Note**: `SUPABASE_SERVICE_ROLE_KEY` is only needed locally to run the seeding script. **Never expose this key in your frontend code or public repository.**

### 3. Database Setup (Crucial!)

1.  Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Go to the **SQL Editor**.
3.  Copy the contents of `schema.sql` from this project.
4.  Paste it into the SQL Editor and click **Run**.
    *   This creates the necessary tables (`products`, etc.) and Row Level Security (RLS) policies.

### 4. Seed Initial Data

Populate your database with sample products using the included script:

```bash
node scripts/seed-products.js
```

This will create a mix of SaaS Starters, Prompts, and UI Kits in your `products` table.

### 5. Running Locally

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:5173` to view the app.

---

## 🚀 Deployment Guide (Vercel)

We recommend Vercel for the easiest deployment experience.

### Step 1: Push to GitHub

Ensure your code is pushed to your GitHub repository.

### Step 2: Import Project in Vercel

1.  Log in to [Vercel](https://vercel.com/).
2.  Click **Add New...** > **Project**.
3.  Select your GitHub repository (`i-devr-code-llc-famousai-site`).
4.  Vercel will detect `Vite` automatically.

### Step 3: Configure Build Settings

*   **Framework Preset**: Vite
*   **Root Directory**: `./` (default)
*   **Build Command**: `npm run build`
*   **Output Directory**: `dist`

### Step 4: Add Environment Variables (IMPORTANT!)

In the "Environment Variables" section of the Vercel project settings, add the following keys from your Supabase project:

*   `VITE_SUPABASE_URL`
*   `VITE_SUPABASE_ANON_KEY`

> You do **NOT** need the service role key here.

### Step 5: Deploy

Click **Deploy**. Vercel will build your site and deploy it to a `.vercel.app` domain.

---

## 🛡️ Admin Dashboard

This project includes a secured Admin Dashboard for store management.

1.  Navigate to `/admin` (e.g., `https://your-site.vercel.app/admin`).
2.  From here, you can:
    *   View key metrics (Revenue, Orders, Users).
    *   See a list of all products.
    *   **Toggle Publish Status**: Instantly show/hide products from the store.
    *   Search and filter products.

---

## 📄 License

Proprietary - i-DevR Code LLC. All rights reserved.
