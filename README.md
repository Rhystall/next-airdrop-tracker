# Airdrop Quest Tracker

A dashboard to track your airdrop farming progress across different chains. Built with SvelteKit and Supabase.

## Tech Stack
- **Framework**: SvelteKit + Vite
- **Database**: Supabase (PostgreSQL)
- **Styling**: CSS Variables + Custom Design System
- **Animations**: GSAP
- **Wallet**: WalletConnect v2 + Injected Providers (MetaMask, etc.)
- **Deployment**: Vercel

## Features
- 🚀 **Interactive Landing Page**: Smooth animations and product highlights.
- 📊 **Airdrop Dashboard**: Filter by chain/difficulty, search, and track progress.
- 💾 **Database Persistence**: All user data (profiles, quests, custom airdrops) is stored in Supabase.
- 👤 **User Profiles**: Customizable profiles with roles, bios, and goals.
- ➕ **Custom Airdrops**: Add any airdrop you're farming to your personal list.
- 🌓 **Dark/Light Mode**: Persisted theme preference.

## Setup & Installation

### 1. Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account
- A [WalletConnect](https://cloud.walletconnect.com) Project ID

### 2. Installation
```bash
git clone https://github.com/yourusername/airdrop-tracker.git
cd airdrop-tracker
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# WalletConnect
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

### 4. Database Setup
1.  Create a new project in Supabase.
2.  Go to the **SQL Editor**.
3.  Run the contents of `schema.sql` to create the initial tables.
4.  Run the contents of `migration.sql` to add the latest columns.

### 5. Run Locally
```bash
npm run dev -- --open
```

## Deployment (Vercel)

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  **Important**: Add the environment variables (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `VITE_WALLETCONNECT_PROJECT_ID`) in the Vercel Project Settings.
4.  Deploy!

## License
MIT
