# Locked-In Challenge

A Next.js full-stack application for the Locked-In Challenge, featuring user authentication, daily submissions, admin panel, and CSV export.

## Features

- **Authentication**: Passwordless login using signed JWT cookies
- **Daily Submissions**: Users can submit one entry per day with timezone handling (Africa/Lagos)
- **Admin Panel**: Admins can view all submissions and export data
- **CSV Export**: Export submissions to CSV format
- **Responsive UI**: Mobile-first design with TailwindCSS
- **Type Safety**: Full TypeScript implementation
- **Database**: PostgreSQL with Prisma ORM

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT cookies
- **Validation**: Zod
- **Testing**: Jest

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd locked-in-challenge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your database URL and JWT secret.

4. Set up the database:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### User Flow

1. **Login**: Enter your email to log in (no password required).
2. **Submit Entry**: On the dashboard, submit your daily locked-in activity.
3. **View Submissions**: See your previous submissions.

### Admin Flow

1. Log in with an admin email (e.g., admin@example.com).
2. Access `/admin` to view all submissions.
3. Export data to CSV.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with demo data
- `npm run export:csv` - Export submissions to CSV

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin page
│   └── page.tsx           # Home page
├── components/            # Reusable components
├── lib/                   # Utility libraries
├── prisma/                # Database schema
├── scripts/               # Seed and export scripts
├── tests/                 # Unit tests
└── README.md
```

## Security

- JWT tokens are signed and stored in HTTP-only cookies
- Rate limiting implemented for API endpoints
- Input validation with Zod
- Admin access controls
- Timezone-specific date logic to prevent exploits

## Testing

Run tests with:
```bash
npm run test
```

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

Ensure your production environment has the required environment variables set.

## License

This project is licensed under the MIT License.
