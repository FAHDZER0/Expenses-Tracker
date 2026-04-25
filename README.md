# Expenses Tracker

A mobile-first personal budget and expense tracking web application built with Next.js, Tailwind CSS, and Supabase.

## 🚀 Live Demo

Test the live deployment here:
**[https://expenses-tracker-jlig.vercel.app/login](https://expenses-tracker-jlig.vercel.app/login)**

*(Note: You will need credentials provided by the administrator to log in, as self-registration is disabled.)*

## ✨ Features

- **Mobile-First Design**: Fully responsive, touch-friendly UI optimized for smartphones.
- **Daily & Monthly Views**: Easily track expenses day-by-day or get a bird's-eye view with the interactive monthly calendar.
- **Summary Dashboard**: Visual breakdown of spending with donut and bar charts (powered by Recharts).
- **Budget Limits**: Set monthly caps per category and monitor your progress.
- **Salary & Savings Tracking**: Input monthly income to automatically calculate savings and running balances.
- **Dark/Light Mode**: Built-in theme toggling for comfortable viewing anytime.
- **CSV Export**: Download your monthly expense data for external use.
- **Customizable**: Personalize category colors to suit your preferences.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: [React Query](https://tanstack.com/query/latest)
- **Deployment**: [Vercel](https://vercel.com/)

## 💻 Local Development

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up environment variables**:
   Copy `.env.local.example` to `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Setup

To run this project locally, you need to set up the Supabase database:
1. Create a new Supabase project.
2. Go to the SQL Editor and run the queries found in `supabase/schema.sql`.
3. Create at least one user account via the Supabase Authentication dashboard to log in to the app.
