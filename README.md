# 🎬 Cinema Ticket Booking System

> A robust, responsive Cinema Ticket Booking System built with **Next.js**, **TypeScript**, and **Tailwind CSS**. Users can log in, browse movies, select showtimes, pick seats from a visual seat map, and complete bookings with dynamic pricing and server-side validation.

---

## 🚀 Live Demo

**[https://cinema-app-chi.vercel.app/](https://cinema-app-chi.vercel.app/)**

> Deployed on Vercel. Use the demo credentials below to log in.

---

## 📦 Clone & Installation

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher
- **Git**

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/dwikailham/cinema-app.git
```

**2. Navigate into the project folder**
```bash
cd cinema-app
```

**3. Install dependencies**
```bash
npm install
```

**4. Run the development server**
```bash
npm run dev
```

**5. Open in browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Credentials

Use the following credentials to log in:

| Username | Password  |
|----------|-----------|
| `rina`   | `rina123` |
| `budi`   | `budi123` |

> You can also check all available users in `data/users.json`.

---

## 🛠️ Technology Stack

| Technology | Description |
|---|---|
| **Next.js** (App Router) | Full-stack React framework |
| **TypeScript** (Strict Mode) | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Zustand** | Lightweight global state management |
| **Lucide React** | Icon library |
| **In-memory API** | Server-side JSON data architecture |

---

## ✨ Features

1. **Authentication** — Cookie-based session management with protected routes (`AuthGuard`).
2. **Movie Browsing** — Dynamic movie listing with genre filtering and search.
3. **Seat Selection** — Visual grid layout (8×12) with real-time seat status (Available, Booked, Selected).
4. **Gap Rule Validation** — Server-side and client-side validation to prevent isolated empty seats.
5. **Dynamic Pricing Engine** — Real-time calculation based on seat zone, day of the week, showtime, and group discounts.
6. **Booking Flow** — 5-minute checkout countdown timer and comprehensive booking confirmation.
7. **Personal Wallet** — A "My Bookings" page to view and manage personal reservations.

---

## 🎨 Design & Color Palette

The application uses a premium, cinematic dark theme with glassmorphism effects.

### Color Tokens

**Background (Cinema Dark):**
- `#0a0a0f` — Main background
- `#12121c` — Cards, Sections
- `#1e1e2e` — Secondary elements
- `#2a2a3e` — Borders, Dividers

**Accent Colors:**
- `#e63946` — Primary buttons, highlights
- `#ff6b6b` — Hover states, gradients
- `#ffd166` — Ratings, premium tags

**Text Colors:**
- `#f1f1f8` — Headings, primary text
- `#a0a0b8` — Subtitles, secondary text
- `#6b6b88` — Captions, inactive elements

**Functional Colors:**
- 🟢 `#22c55e` — Available seat
- 🔵 `#3b82f6` — Selected seat
- ⬛ `#374151` — Booked seat

---

## 📁 Project Structure

```
cinema-app/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/                # Server-side API endpoints
│   ├── bookings/           # My Bookings page
│   ├── login/              # Login page
│   └── movies/             # Movie listing & detail pages
├── components/             # Reusable UI components
│   ├── layout/             # Navbar, AuthGuard
│   ├── movies/             # MovieCard, SearchBar, GenreFilter
│   ├── pricing/            # PriceBreakdown
│   ├── seats/              # SeatMap, SeatButton, CountdownTimer
│   └── ui/                 # Button, Card, Input, Badge
├── data/                   # Mock data (JSON files)
├── lib/                    # Business logic (pricing, gap rule, session)
├── store/                  # Zustand stores
└── types/                  # TypeScript type definitions
```
