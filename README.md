# Narcoguard - Overdose Prevention Platform

![Narcoguard Logo](public/images/narcoguard-icon.png)

## Overview

Narcoguard is a comprehensive overdose prevention platform designed to save lives through real-time monitoring, community response, and cutting-edge technology. The application leverages wearable devices, AI-powered analysis, and a network of trained volunteers to detect and respond to potential overdose situations before they become fatal.

## Key Features

- **Real-time Vital Sign Monitoring**: Continuously tracks heart rate, respiratory rate, oxygen levels, and other vital signs to detect signs of overdose.
- **Emergency Response System**: Automatically alerts emergency contacts, nearby volunteers, and emergency services when an overdose is detected.
- **Hero Network**: A community of trained volunteers who can respond to nearby emergencies with naloxone and life-saving support.
- **Naloxone Locator**: Helps users find the nearest available naloxone kits in their area.
- **Medical Integration**: Connects with healthcare providers and medical records for comprehensive care.
- **Training & Resources**: Provides educational content on overdose prevention, recognition, and response.
- **Privacy-Focused**: Ensures user data is secure and private while still enabling life-saving interventions.

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **State Management**: React Context API, React Query
- **Styling**: Tailwind CSS, shadcn/ui components
- **Animations**: Framer Motion
- **Maps & Geolocation**: Leaflet
- **Analytics**: Custom analytics implementation
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account
- Twilio account (for SMS notifications)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-organization/narcoguard.git
   cd narcoguard
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Authentication
   JWT_SECRET=your_jwt_secret
   
   # Twilio (for SMS)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   
   # Analytics
   ANALYTICS_API_URL=your_analytics_api_url
   ANALYTICS_API_KEY=your_analytics_api_key
   ANALYTICS_APP_ID=narcoguard
   
   # Email
   EMAIL_HOST=your_email_host
   EMAIL_PORT=your_email_port
   EMAIL_SECURE=true
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password
   EMAIL_FROM=noreply@narcoguard.org
   
   # Download paths
   ANDROID_APK_PATH=path_to_android_apk
   WINDOWS_INSTALLER_PATH=path_to_windows_installer
   MAC_DMG_PATH=path_to_mac_dmg
   LINUX_APPIMAGE_PATH=path_to_linux_appimage
   \`\`\`

4. Set up the database:
   \`\`\`bash
   npm run setup-db
   # or
   yarn setup-db
   \`\`\`

5. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

\`\`\`
narcoguard/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   ├── components/         # App-specific components
│   ├── dashboard/          # Dashboard pages
│   ├── download/           # Download pages
│   ├── hero-network/       # Hero Network pages
│   ├── resources/          # Resource pages
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # Shared components
│   ├── ui/                 # UI components (shadcn/ui)
│   ├── feature-section.tsx # Feature section component
│   └── ...                 # Other components
├── lib/                    # Utility functions and services
│   ├── analytics-service.ts # Analytics service
│   ├── emergency-service.ts # Emergency service
│   ├── monitoring-service.ts # Vital sign monitoring
│   ├── user-service.ts     # User management
│   ├── accessibility.ts    # Accessibility utilities
│   ├── error-handling.ts   # Error handling utilities
│   └── ...                 # Other utilities
├── public/                 # Static assets
├── scripts/                # Build and setup scripts
├── .env.example            # Example environment variables
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
\`\`\`

## Core Services

### Emergency Service

The Emergency Service is responsible for detecting and responding to potential overdose situations. It integrates with the Monitoring Service to analyze vital signs and triggers appropriate responses when dangerous patterns are detected.

Key features:
- Real-time vital sign analysis
- Multi-level alerting system
- Integration with emergency services
- Location-based responder coordination

### Monitoring Service

The Monitoring Service continuously tracks and analyzes vital signs from connected devices. It uses sophisticated algorithms to detect patterns indicative of an overdose or medical emergency.

Key features:
- Real-time data processing
- Customizable alert thresholds
- Historical data analysis
- Device integration

### User Service

The User Service manages user accounts, profiles, and authentication. It handles user registration, login, profile management, and emergency contact configuration.

Key features:
- Secure authentication
- Profile management
- Emergency contact management
- Privacy controls

### Analytics Service

The Analytics Service tracks application usage, performance metrics, and emergency events to provide insights for continuous improvement.

Key features:
- Usage tracking
- Performance monitoring
- Emergency response analytics
- Privacy-preserving data collection

## Contributing

We welcome contributions to Narcoguard! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- This project was inspired by the ongoing opioid crisis and the need for innovative solutions to prevent overdose deaths.
- Special thanks to all the healthcare professionals, harm reduction specialists, and first responders who work tirelessly to save lives.
