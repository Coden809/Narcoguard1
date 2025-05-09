# Narcoguard

Narcoguard is a comprehensive application designed to prevent overdose deaths through advanced monitoring and alert systems. The application connects users with life-saving help in critical moments.

## Features

- Real-time vital sign monitoring
- Emergency alert system
- Location tracking for emergency services
- Naloxone administration guidance
- Hero Network community support
- Offline functionality
- Multi-platform support (Web, iOS, Android, Desktop)

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: React Context API
- **API**: Next.js API Routes
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/narcoguard.git
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
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ANDROID_APK_PATH=/downloads/android/narcoguard.apk
   WINDOWS_INSTALLER_PATH=/downloads/windows/narcoguard-setup.exe
   MAC_DMG_PATH=/downloads/mac/narcoguard.dmg
   LINUX_APPIMAGE_PATH=/downloads/linux/narcoguard.AppImage
   JWT_SECRET=your-jwt-secret
   TWILIO_ACCOUNT_SID=your-twilio-account-sid
   TWILIO_AUTH_TOKEN=your-twilio-auth-token
   TWILIO_PHONE_NUMBER=your-twilio-phone-number
   ANALYTICS_API_URL=your-analytics-api-url
   ANALYTICS_API_KEY=your-analytics-api-key
   ANALYTICS_APP_ID=your-analytics-app-id
   EMAIL_HOST=your-email-host
   EMAIL_PORT=your-email-port
   EMAIL_SECURE=true
   EMAIL_USER=your-email-user
   EMAIL_PASS=your-email-password
   EMAIL_FROM=noreply@narcoguard.com
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

\`\`\`
narcoguard/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── components/       # App-specific components
│   ├── dashboard/        # Dashboard pages
│   ├── download/         # Download pages
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── components/           # Shared components
│   ├── ui/               # UI components (shadcn)
│   └── ...               # Other shared components
├── lib/                  # Utility functions
│   ├── utils.ts          # General utilities
│   ├── auth.ts           # Authentication utilities
│   ├── analytics.ts      # Analytics utilities
│   ├── performance.ts    # Performance utilities
│   ├── security.ts       # Security utilities
│   └── accessibility.ts  # Accessibility utilities
├── public/               # Static assets
├── scripts/              # Build and setup scripts
├── .env.local            # Environment variables (not in repo)
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
\`\`\`

## Deployment

The application is configured for deployment on Vercel. Connect your GitHub repository to Vercel for automatic deployments.

## Performance Optimizations

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Server-side rendering and static generation
- Debounced and throttled event handlers
- Memoization of expensive calculations
- Intersection Observer for lazy loading components

## Accessibility

The application follows WCAG 2.1 AA standards:

- Proper heading hierarchy
- ARIA attributes for interactive elements
- Keyboard navigation support
- Focus management for modals and dialogs
- Color contrast compliance
- Screen reader announcements
- Reduced motion support

## Security Measures

- Input validation and sanitization
- Content Security Policy
- HTTPS enforcement
- Protection against XSS and CSRF
- Secure authentication flows
- Rate limiting on API routes
- Secure HTTP headers

## Browser Compatibility

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- iOS Safari (latest 2 versions)
- Android Chrome (latest 2 versions)

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact support@narcoguard.com.
\`\`\`

Let's create a cross-browser compatibility utility:
