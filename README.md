# LuxeMart E-commerce Project

## Getting Started

The project structure is split into two applications:

- `web`: Next.js application for the Storefront and Admin Panel.
- `mobile`: Expo (React Native) application for Android and iOS.

### Web Setup

1. **Install Dependencies**

   ```bash
   cd web
   npm install
   ```

2. **Setup Database**
   This project uses SQLite for local development.

   ```bash
   npx prisma db push
   # Seed the database with initial products and admin user
   node prisma/seed.js
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) for the Storefront.
   Open [http://localhost:3000/admin](http://localhost:3000/admin) for the Admin Dashboard.

### Mobile Setup

1. **Install Dependencies**

   ```bash
   cd mobile
   npm install
   ```

2. **Run the App**
   ```bash
   npx expo start
   ```

   - Scan the QR code with the **Expo Go** app on your Android/iOS device.
   - Or press `a` to run on Android Emulator / `i` for iOS Simulator.

## Architecture

- **Frontend**: Next.js 14 (App Router), Tailwind CSS.
- **Backend**: Next.js Server Actions, Prisma ORM, SQLite.
- **Mobile**: React Native (Expo).
