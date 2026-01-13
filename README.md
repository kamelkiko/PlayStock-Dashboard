# 🚀 PlayStock Dashboard

A premium, SaaS-grade dashboard application built for managing the PlayStock gaming ecosystem. This project features a modern, high-end "Dark/Glass" aesthetic, moving away from traditional admin templates to a custom, design-first approach similar to Linear, Vercel, or Stripe.

## 🛠 Tech Stack

- **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [Material UI (MUI)](https://mui.com/) - *Heavily customized*
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **Internationalization:** [i18next](https://www.i18next.com/) (English & Arabic/RTL)
- **Icons:** MUI Icons & Custom SVGs
- **Build Tool:** Vite

---

## 🎨 Design System & Aesthetics

This project follows strict design rules to ensure a premium feel:

1.  **NO Generic Material UI:** The default MUI look is forbidden. All components (Cards, Buttons, Inputs) are overridden in `src/theme` to look sleek, rounded, and modern.
2.  **Custom Palette:** Uses a specific color scheme derived from the logo (Deep Violet, Cyber Cyan, Magenta).
3.  **Glassmorphism:** Extensive use of `backdrop-filter: blur()` and transparent backgrounds (`rgba`).
4.  **Layout:**
    *   **Sidebar:** Slim, icon-first, collapsible.
    *   **Header:** Floating glass bar.
    *   **Grid:** Uses CSS Grid/Flexbox via MUI `Box` and `Stack`. Avoid nested `Grid` unless necessary for responsive columns.
5.  **Motion:** Subtle hover lifts, smooth transitions, and skeleton loading states.

---

## 📂 Project Structure

```
src/
├── api/            # API services (axios setup, endpoint definitions)
├── assets/         # Statc images and global styles
├── components/
│   ├── ui/         # Reusable premium UI components (StoreCard, StatCard, etc.)
│   └── ...
├── contexts/       # React Contexts (Notification, etc.)
├── layouts/        # Layout wrappers (AppShell, Header, Sidebar, AuthLayout)
├── locales/        # i18n JSON translation files (en, ar)
├── pages/          # Main route pages (Dashboard, Stores, Games, etc.)
├── stores/         # Zustand global stores (auth, ui)
├── theme/          # Custom MUI theme configuration
│   ├── components/ # Component-specific overrides
│   ├── customTheme.ts # Core palette & typography
│   └── ...
├── App.tsx         # Main app entry & routing
└── main.tsx        # React root
```

---

## ✅ Current Progress

- [x] **Authentication:** Login flow with JWT handling.
- [x] **Core Layout:** Premium Sidebar & Header with RTL support and Theme Toggle.
- [x] **Dashboard:** Overview page with Stat Cards and Charts structure.
- [x] **Stores Module:**
    *   `StoreList`: Card-based grid view with glass UI.
    *   `StoreDetails`: Dashboard-style detail view (KPIs, Activity).
    *   Data fetch logic implementing `StoreUI` extended types.
- [x] **Games Module:** Grid view with cover images and pricing management.

---

## 🤖 For AI Contributors (Context Handoff)

If you are an AI assistant continuing this work, please adhere to the following context:

1.  **Design Philosophy:**
    *   **Do not revert to standard MUI.** If creating a new component, check `src/theme/` and existing `components/ui` for style reference.
    *   **Cards > Tables:** For lists (Stores, Games), prefer rich card grids over data tables unless dense data density is strictly required.

2.  **Code Patterns:**
    *   Use **Zustand** for global UI state (`src/stores/uiStore.ts`).
    *   Use **React Query** or simple `useEffect` + API services for data fetching (current pattern).
    *   **Type Safety:** strictly define interfaces in `src/api/types.ts`. Extends base API types with UI-specific fields (e.g., `StoreUI`) if the backend data is missing view-specific needs.

3.  **Next Tasks:**
    *   **`StoreForm.tsx`:** Implement the Create/Edit Store form. It must be a multi-step or sectioned form (not a long vertical scroll) with validation.
    *   **Outlets/Vendors/Customers:** Refactor these pages to match the new "Premium Card" aesthetic (they may still use older table styles).
    *   **Settings Page:** Redesign the settings to use clean toggles and sections.

---

## 🚀 Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```

3.  **Build for Production:**
    ```bash
    npm run build
    ```
