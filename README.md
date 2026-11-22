# FitBuddy by WebWeavers - Live Daily Fitness Tracker & Day-Wise Workout Planner

> **CSE326: Internet Programming Final Comprehensive Project**  
> Engineered by **WebWeavers** using modern semantic HTML5, pure CSS3 (Vibrant Athletic Orange & Crisp White Design System), vanilla ES6+ JavaScript, Progressive Web App (PWA) standards, and real-time browser APIs.

---

## 🌟 Overview & Capabilities

FitBuddy by WebWeavers is a full-featured, production-ready web application engineered to satisfy **100% of the course syllabus (Units I–VI)** and every specific operational requirement:

1. **User Authentication**: Secure Sign In and Sign Up with real client-side account storage in `localStorage`. Includes a live password complexity meter (8+ chars, upper, lower, numbers, symbols) and remember-me persistence.
2. **0-Metric Fresh Start Onboarding**: Upon signing up, the user is prompted for their **Full Name**, **Athlete Avatar**, and **Primary Fitness Goal**. All metrics (**Steps: 0, Calories: 0, Water: 0 ml, Activities: 0, Streak: 0 Days**) strictly initialize to zero so every athlete starts with a clean slate.
3. **Profile Management**: Complete athlete profile modal with real-time BMI score calculator and WHO categorization badge, editable daily targets (Steps, Water, Calories), daily fitness mindset motto, avatar picker, and **Role Selector (Athlete vs Staff / Coach)**.
4. **Create & Manage Records**: Log workouts with activity type, duration, calories burned, distance, date, time, perceived effort, and notes. Records can be **edited inline**, **deleted with confirmation**, or **exported to CSV or JSON** with 1 click.
5. **Day-Wise Workout Planner (Separate Gym vs Home Sections)**:
   - **🏋️ Gym Workouts Plan**: 7-day science-backed split (Push Day, Pull Day, Quad Overload, Delts & Abs, Hamstring/Glute Hypertrophy, Upper Power, Active Recovery) featuring barbells, dumbbells, cables, and machines.
   - **🏠 Home Workouts Plan**: 7-day calisthenics, bodyweight circuits, resistance bands, and mobility routines.
   - **1 to 2 Alternative Options for Every Exercise**: Every single exercise across all 7 days includes 1 or 2 alternative options with a 1-click **`⇄ Swap`** button that dynamically swaps the variation into the primary plan.
   - **Day Status Tracking**: Toggle each day between `📅 Planned`, `⏳ In Progress`, and `✓ Completed`.
   - **Exercise Search Bar**: Real-time search across the entire schedule to find exercises by name or muscle group.
   - **Drag-and-Drop Library**: HTML5 Drag & Drop pool to drag custom exercises into any day column.
6. **Day-Wise Nutrition & Diet Section (🌱 Veg & 🍗 Non-Veg)**:
   - Comprehensive 7-day science-backed athletic meal plan (ISSN & NIH guidelines).
   - **5 Meals Every Day**: Breakfast, Mid-Morning, Lunch, Evening Snack, Dinner.
   - **Side-by-Side Splits**: Distinct 🌱 Vegetarian (plant & dairy clean) and 🍗 Non-Vegetarian (bioavailable lean protein) options for every single meal.
   - **Exact Macro Breakdown**: Calories, Protein (g), Carbs (g), Healthy Fats (g), and Key Micronutrients.
   - **Real-Time Dietary Filters**: Switch between `🥗 All Options`, `🌱 Vegetarian Only`, and `🍗 Non-Veg Only` with 1 click.
   - **Ingredient & Food Search**: Instant filter for ingredients like paneer, tofu, chicken, eggs, quinoa, etc.
   - **1-Click `+ Log Meal`**: Directly logs consumed meals into the user's daily fitness tracker, updating active calories and dashboard rings.
   - **Web Extraction Tools**:
     - `Extract Diet JSON`: 1-click download of the complete 7-day nutrition database as `fitbuddy_daywise_diet_plan.json`.
     - `Copy Raw Diet JSON`: Instant clipboard copy of the structured JSON schema.
     - `Sync Web Nutrition`: Live sync and refresh from web/JSON standards.
7. **Progress & History Tracking**:
   - Consecutive daily streak algorithm with flame counter badge 🔥.
   - Dynamic 7-day SVG Calorie & Volume bar chart recalculated live from actual logged workouts.
   - Filterable activity diary with sort options (date, calories, duration).
8. **Search & Filter**: Real-time search by activity title, category, and notes; filter by category (Cardio, Strength, HIIT, Walking, Swimming, Yoga) and status (Completed, In Progress).
9. **Status Updates**:
   - Interactive **Daily Athlete Status Bar** to post fitness mottos and daily progress.
   - 1-Click status toggle on activity records (`Completed` ⇄ `In Progress`).
   - 1-Click status toggle on scheduled workout days (`Planned` ⇄ `In Progress` ⇄ `Completed`).
   - **Coach Broadcast Feed**: Live announcements from coaches visible on athlete dashboards.
10. **Role-Based Access for Staff / Admin**:
   - Switch seamlessly between **🏃 Athlete Mode** and **🛡️ Coach / Staff Mode**.
   - Pre-configured Admin account: `admin@fitbuddy.app`  / `Admin@1234`.
   - **Coach & Staff Admin Portal**:
     - **Registered Athlete Member Roster**: Real-time table displaying all member accounts, their logged workout count, total calories burned, current streak, and active status.
     - **Broadcast Gym Announcement Form**: Publish announcements and challenge updates that appear on all athletes' dashboards.
     - **Aggregate Platform KPIs**: Total platform workouts, total calories burned, active members count.
11. **Interactive Online GPS & Leaflet OpenStreetMap**:
    - Live workout session modal with real Leaflet OpenStreetMap tiles, live satellite GPS coordinates, pulsing athlete location marker, route polyline tracking, and live MET calorie calculation ($\text{Calories} = \text{MET} \times \text{Weight} \times \text{Hours}$).
12. **Responsive Orange & White UI**:
    - Vibrant Energetic Orange (`#ff6000`) and Crisp White (`#ffffff`) athletic aesthetic.
    - Dark mode toggle option for nighttime workouts.
    - Fully responsive across mobile (360px+), tablet, and desktop viewports.
    - Print media stylesheet (`@media print`) for clean printable workout logs.

---

## 🌐 Opening the Website in Any Browser

FitBuddy by WebWeavers is built with pure web standards and works seamlessly on **Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari, Opera, Brave**, and mobile browsers.

### Method 1: Instant 1-Click Windows Launcher (Recommended)
Double-click `launch-website.bat` in the project folder:
- It launches a local HTTP server using Windows PowerShell's built-in .NET engine (no Node.js or Python required!).
- Automatically opens `http://localhost:8080` in your default browser.

### Method 2: Direct File Opening
Double-click `index.html` in Windows Explorer. The application will open directly in your browser (`file:///.../index.html`) with embedded fallbacks so all features work immediately.

### Method 3: Deploy Online for Free (Anyone can search & access it worldwide!)
Because FitBuddy is 100% static client-side code:
1. **GitHub Pages**: Push this repository to GitHub and enable GitHub Pages in Settings → Pages. Your site will be live at `https://<username>.github.io/<repo-name>/`.
2. **Netlify Drop**: Drag and drop this folder onto [app.netlify.com/drop](https://app.netlify.com/drop) for a free instant live HTTPS URL in 10 seconds.
3. **Vercel**: Deploy via the Vercel CLI (`vercel`) or connect your GitHub repository for instant global CDN hosting.

---

## 📱 Progressive Web App (PWA) & SEO Features
- **PWA Manifest (`manifest.json`)**: Configured with athletic theme colors (`#ff6000`), icons, and `display: standalone` for mobile/desktop installability.
- **Service Worker (`sw.js`)**: Intelligent network-first and cache-fallback strategy for fast load times and offline support.
- **SEO & Web Crawlers**: Complete Open Graph (`og:*`), Twitter Cards (`twitter:*`), Schema.org JSON-LD structured data, `robots.txt`, and `sitemap.xml` for Googlebot and search engines.

---

## 🔑 Quick Testing Accounts

| Role | Email | Password | Features |
|---|---|---|---|
| **Athlete (Personal)** | `demo@fitbuddy.app`  | `Fit@1234` | Personal workout logging, Day-Wise Planner, GPS tracker, streak counter |
| **Coach / Staff (Admin)** | `admin@fitbuddy.app` ** | `Admin@1234` | Member Roster table, Broadcast announcements, aggregate gym KPIs |

*Note: You can also click **"Create Account"** to register a new user. The onboarding flow will ask for your Full Name and guarantee a fresh start with zero metrics.*
