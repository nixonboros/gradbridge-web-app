# GradBridge

**GradBridge: AI-Enhanced Networking & Recruitment Platform**

GradBridge began as a capstone startup project, originally prototyped in Figma. Now, it is being individually developed into a fully functional web application.

The platform is designed to connect graduates with industry professionals and employers, and incorporates:

- **Event Management:** Organize and discover networking events, workshops, and career fairs.
- **AI-Driven Resume Assistance:** Get personalized feedback and suggestions to improve your resume using AI.
- **Mock Interview Simulations:** Practice and prepare for real interviews with AI-powered mock interview tools.
- **Professional Networking:** Build connections with mentors, recruiters, and peers in your field.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure
```
gradbridge-web-app
├── public/                          # Static files served directly 
├── src/                             # Source code for the application
│   ├── assets/                      # Images, SVGs, and other static assets
│   ├── components/                  # Reusable React components
│   │   └── LoginPage/               # Login page component and its styles
│   │       ├── LoginPage.tsx
│   │       └── LoginPage.css
│   ├── pages/                       # (Recommended) Route-level components/pages
│   ├── App.tsx                      # Main application component
│   ├── App.css                      # Global styles for the app
│   ├── index.css                    # CSS resets and base styles
│   ├── main.tsx                     # Entry point: renders <App /> into the DOM
│   └── vite-env.d.ts                # Vite-specific TypeScript definitions
├── .gitignore                       # Git ignore rules
├── package.json                     # Project metadata and dependencies
├── package-lock.json                # Exact dependency versions
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.node.json               # Node-specific TypeScript config
├── tsconfig.app.json                # App-specific TypeScript config
├── vite.config.ts                   # Vite build tool configuration
└── README.md                        # Project documentation
```
---

Developed as a capstone project to bridge the gap between graduates and the professional world with the power of AI.

Originally a Figma prototype, now being transformed into a real, production-ready web application.
