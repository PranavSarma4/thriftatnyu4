# Thrift@NYU

A sustainable clothing resale platform for NYU students. Submit your pre-loved clothes, we pick them up, sell them, and you get paid!

## Features

- 📦 **Easy Submission** - Simple multi-step form to submit your clothes
- 🚚 **Free Pickup** - We come to you across NYC
- 📍 **Track Orders** - Real-time tracking of your submissions
- 🗺️ **Admin Dashboard** - Map view and management for pickups
- 💰 **Get Paid via Zelle** - Quick payments when items sell

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Maps**: Google Maps API (optional)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd thriftatnyu4
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database URL:
```
DATABASE_URL="postgresql://username:password@localhost:5432/thriftatnyu?schema=public"
```

4. Push the database schema:
```bash
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment on Vercel

### 1. Create a Vercel Project

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and create a new project
3. Import your GitHub repository

### 2. Set Up Vercel Postgres

1. In your Vercel project, go to **Storage** tab
2. Click **Create Database** → **Postgres**
3. Follow the prompts to create a new Postgres database
4. The `DATABASE_URL` will be automatically added to your environment variables

### 3. Deploy

1. Click **Deploy**
2. Vercel will automatically:
   - Install dependencies
   - Generate Prisma client
   - Build the Next.js app
   - Deploy to production

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key for admin map | No |

## Database Commands

```bash
# Push schema changes to database (development)
npm run db:push

# Create migrations (development)
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio
```

## Pages

- `/` - Landing page with features, testimonials, and CTAs
- `/submit` - Multi-step form to submit clothes
- `/track` - Track submission status by email
- `/admin` - Admin dashboard (password: `admin123`)

## Admin Dashboard Features

- View all submissions in list or map view
- Filter by status
- Search by name, email, or address
- Update submission status
- Schedule pickups with date/time
- Add admin notes
- View customer details

## License

MIT

## Support

For questions or issues, email hello@thriftatnyu.com
