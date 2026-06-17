# Simplified CSAT Campaign Builder

A high-fidelity Customer Satisfaction (CSAT) Campaign Builder. This tool allows product managers and designers to configure, style, and brand mobile CSAT popups in real time, featuring an interactive phone simulator showing instant visual feedback.

---

## 🚀 Key Features

### 1. Dual-Mode Live Mobile Sandbox
- **Realistic Phone Frame**: Rendered with curved corners, a top camera notch (mock dynamic island), cellular/5G/Wi-Fi icons, battery stats, and a clock matching local system time.
- **Interactive Step Navigation**: Quick tabs at the top of the mobile screen allow the builder to force-preview the **Welcome (Initial) Screen**, the **Feedback Form**, or the **Thank You Screen** while designing.
- **Full Journey Click-Through**: The phone screen is fully interactive. Clicking buttons in the preview moves the survey forward, rating triggers selected states, dynamic tags toggle active colors, and clicking "Submit" fires a celebration confetti sequence!

### 2. Tabbed Admin Setup Control Panel
- **Content Configuration Tab**:
  - *Initial Feedback Screen*: Configure customized title and description copy.
  - *Feedback Form Screen*: Choose between **Star Ratings** and **Numeric Ratings (1-5)**. Manage dynamic option tags (add/delete tags like "Fast Resolution" or "Needs Improvement"). Toggle an additional comments text area on/off. Customize the submission button text.
  - *Thank You Screen*: Upload custom media. Supports PNG, JPG, JPEG, GIF, and Lottie animations (.json files). Edit completion headers and closing button labels.
- **Styling Configuration Tab**:
  - *Branding Presets*: 4 preset themes (Sunset Glow, Ocean Breeze, Midnight Neon, Emerald Clean) to style colors with a single click.
  - *Color Pickers*: Individually tweak background card, titles, subtitles, buttons, button labels, and selected/unselected rating metrics.
  - *Layout & Sizing Sliders*: Customize card border radius (0px to 36px), button height (32px to 60px), and button width (40% to 100%).
  - *Typography Pickers*: Choose header font size and font weights.

---

## 🛠️ Tech Stack

- **Core**: React 19 (TypeScript)
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS v4 (configured via the `@tailwindcss/vite` compiler plugin)
- **Icons**: Lucide React
- **Animations**: Canvas Confetti (celebration feedback) and standard CSS keyframes
- **Lottie Rendering**: Web Component `@lottiefiles/lottie-player` loaded via CDN in index.html (allowing light bundle sizes and base64 JSON previews)

---

## 📁 Folder Structure

```text
AppVersal/
├── dist/                  # Compiled production assets
├── node_modules/          # Project dependencies
├── src/
│   ├── assets/            # Static image assets and logo placeholders
│   ├── components/        # Reusable UI component modules
│   │   ├── CSATPopup.tsx     # The core CSAT Survey popup card widget
│   │   ├── DevicePreview.tsx # Sleek phone mockup container and simulator
│   │   └── CampaignEditor.tsx# Tabbed controls panel with form fields & pickers
│   ├── App.tsx            # Main state manager and workspace layout
│   ├── main.tsx           # React mounting entrypoint
│   ├── index.css          # Tailwind imports, custom font families & keyframes
│   └── vite-env.d.ts      # Custom web components type definitions (Lottie)
├── index.html             # Main index template (loads Lottie player script)
├── package.json           # Project manifest and build scripts
├── vite.config.ts         # Vite bundler options with Tailwind plugin
└── tsconfig.json          # TypeScript configurations
```

---

## 💻 Local Setup & Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended) along with `npm`.

1. **Clone the repository or extract the project zip:**
   ```bash
   cd AppVersal
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Launch the local Vite development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to the address shown in your terminal (usually `http://localhost:5173`).

4. **Compile the production-ready build:**
   ```bash
   npm run build
   ```
   This will output optimized HTML, CSS, and JS bundles to the `/dist` folder.

---

## 🌐 Deployment

This project is fully ready for zero-config hosting on Vercel, Netlify, or Firebase Hosting.

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the root project folder and follow the prompts.
3. Live Link: `https://csat-campaign-builder.vercel.app` (Replace with your actual deployment link once hosted)
