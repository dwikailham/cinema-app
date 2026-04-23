# Cinema Ticket Booking System

A robust, responsive Cinema Ticket Booking System built with Next.js 14, TypeScript, and Tailwind CSS. This application allows users to log in, browse movies, select showtimes, pick seats from a visual seat map, and complete bookings with dynamic pricing and server-side validation.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data Architecture**: In-memory server-side API (JSON files)

## Features

1. **Authentication**: Cookie-based session management with protected routes (`AuthGuard`).
2. **Movie Browsing**: Dynamic movie listing with genre filtering and search functionality.
3. **Seat Selection**: Visual grid layout (8x12) with real-time seat status (Available, Booked, Selected).
4. **Gap Rule Validation**: Server-side and client-side validation to prevent isolated empty seats.
5. **Dynamic Pricing Engine**: Real-time calculation based on seat zone, day of the week, showtime, and group discounts.
6. **Booking Flow**: 5-minute checkout countdown timer and comprehensive booking confirmation.
7. **Personal Wallet**: A dedicated "My Bookings" page to view and manage personal reservations.

## Design & Color Palette

The application uses a premium, cinematic dark theme with glassmorphism effects.

### Color Tokens

- **Background (Cinema Dark)**: 
  - `--color-cinema-950`: `#0a0a0f` (Main background)
  - `--color-cinema-900`: `#12121c` (Cards, Sections)
  - `--color-cinema-800`: `#1e1e2e` (Secondary elements)
  - `--color-cinema-700`: `#2a2a3e` (Borders, Dividers)

- **Accent Colors**:
  - `--color-accent-500`: `#e63946` (Primary buttons, highlights)
  - `--color-accent-400`: `#ff6b6b` (Hover states, gradients)
  - `--color-gold-400`: `#ffd166` (Ratings, Premium tags)

- **Text Colors**:
  - `--color-text-primary`: `#f1f1f8` (Headings, primary text)
  - `--color-text-secondary`: `#a0a0b8` (Subtitles, secondary text)
  - `--color-text-muted`: `#6b6b88` (Captions, inactive elements)

- **Functional Colors**:
  - Available: `#22c55e` (Green)
  - Selected: `#3b82f6` (Blue)
  - Booked: `#374151` (Gray)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Default Users

You can use the following credentials to log in (or refer to `data/users.json`):
- Username: `rina` / Password: `rina123`
- Username: `budi` / Password: `budi123`
