# DealDrop Implementation Plan

## Context

Building DealDrop, a points-based travel deal search engine + subscriber dashboard, as a portfolio prototype for the Daily Drop Frontend Software Engineer role. The PRD is at `prd.md`. This is a greenfield project - only the PRD and a screenshot of the actual Daily Drop site exist.

**Key decisions:**
- **Dark theme** inspired by Daily Drop's actual website (dark backgrounds, teal/purple accents)
- **Pure Tailwind CSS** from scratch - no component libraries (shadcn, Radix, etc.)
- **create-next-app** for project initialization (TypeScript + Tailwind + App Router)

---

## Phase 1: Foundation (~1-1.5h)

### 1.1 Scaffold Project
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias
```

### 1.2 Design Tokens - `tailwind.config.ts`
Adapt the PRD's color system to dark theme:
- `--bg-primary`: `#0f172a` (slate-900, main background)
- `--bg-card`: `#1e293b` (slate-800, card surfaces)
- `--bg-elevated`: `#334155` (slate-700, elevated elements)
- `--brand-primary`: `#0ea5e9` (sky-500, primary actions - inspired by Daily Drop teal)
- `--brand-accent`: `#a855f7` (purple-500, pro/upgrade elements)
- `--deal-great`: `#22c55e` (green-500)
- `--deal-good`: `#3b82f6` (blue-500)
- `--deal-fair`: `#6b7280` (gray-500)
- `--text-primary`: `#f8fafc` (slate-50)
- `--text-secondary`: `#94a3b8` (slate-400)
- `--border`: `#334155` (slate-700)
- `--surface-cache`: `#0c4a6e` (sky-900, cache status bar)

### 1.3 Types - `src/types/index.ts`
All TypeScript types from PRD Section 7.1: `PointsProgram`, `CabinClass`, `DealQuality`, `Airport`, `ProgramOption`, `Deal`, `UserSettings`, `SavedDeal`, `TravelGoal`, `SearchState`, `CacheEntry`, `SearchResponse`, `SortOption`, `TabId`, `EventName`, `ExperimentVariant`, `Experiment`

### 1.4 Constants - `src/lib/constants.ts`
- 25+ airports (12 US hubs + 13 international from PRD 9.1)
- `PROGRAM_INFO` record with display names, colors, short names per program
- CPP thresholds: `{ great: 1.8, good: 1.3 }`
- Cache TTL: 15 min, Simulated delay: 400-900ms, Error rate: 5%
- Month options (current + 11 months)
- Default settings (Sarah persona from PRD 9.3)
- Default travel goal (Japan trip)

### 1.5 Utilities
- `src/lib/formatters.ts` - `formatPoints()`, `formatCurrency()`, `formatCpp()`, `formatTimeAgo()`, `formatRoute()`, `formatMonthYear()`
- `src/lib/dealScoring.ts` - `calculateCpp()`, `getDealQuality()`, `getBestProgramOption()`
- `src/lib/recommendationScoring.ts` - `scoreRecommendation()` (PRD 7.4 algorithm: origin +40, program +20, cabin +15, nonstop +10, popularity +0-15)
- `src/lib/analytics.ts` - `track()` function logging structured events to console
- `src/lib/experiment.ts` - A/B test assignment (50/50 sort default: best_value vs lowest_points)

### 1.6 Mock Data - `src/data/mockDeals.ts`
55+ deals generated from 20 route templates across:
- 6+ US origins, 12+ destinations, all 7 programs, all cabin classes
- Realistic pricing per PRD 9.2 tables
- Each deal: 2-4 program options with points/taxes/CPP/bookingSteps
- Popularity scores 0-100 (few viral deals at 85+)
- Pre-calculated `bestCpp` and `quality`

### 1.7 Services
- `src/services/cacheService.ts` - In-memory Map + localStorage, key generation, TTL, hydration
- `src/services/dealService.ts` - `searchDeals()`, `getTrendingDeals()`, `getRecommendedDeals()`, `getDealById()`, `getSimilarDeals()` with simulated network delay + 5% error rate

**Verify:** `npm run dev` works, import mock deals and log count, call `searchDeals` and verify cache behavior in console.

---

## Phase 2: Deal Card + Detail (~1.5-2h)

### 2.1 UI Primitives
- `src/components/ui/SkeletonLoader.tsx` - Shimmer animation with dark theme colors
- `src/components/ui/Badge.tsx` - Variant-based badge (great/good/fair/pro)
- `src/components/ui/Tooltip.tsx` - CSS hover tooltip with arrow
- `src/components/ui/EmptyState.tsx` - Centered icon + title + description + action
- `src/components/ui/ErrorState.tsx` - Warning icon + message + retry button

### 2.2 Deal Components
- `src/components/deals/DealBadge.tsx` - Quality badge with icon + text (never color alone)
- `src/components/deals/PointsComparison.tsx` - Program options grid with points/taxes/CPP, best value indicator
- `src/components/deals/DealCardSkeleton.tsx` - Loading placeholder matching card dimensions
- **`src/components/deals/DealCard.tsx`** - THE HERO COMPONENT
  - Route display (JFK → NRT), city names, DealBadge, save heart button
  - PointsComparison (compact), metadata line, updated timestamp
  - Hover: `translateY(-2px)` + glow, 150ms ease
  - Save: heart toggle with scale animation, analytics event
  - Keyboard: Tab focus, Enter to open, S to save
  - `isBlurred` prop for paywall
  - Dark card surface (`bg-card`) with subtle border
- `src/components/deals/DealGrid.tsx` - Responsive grid (1-col mobile, 2-col desktop)

### 2.3 Deal Detail
- `src/components/ui/Drawer.tsx` - Slide panel (right on desktop 480px, bottom sheet on mobile), focus trap, Escape/backdrop close
- `src/components/deals/CppTooltip.tsx` - CPP explanation tooltip
- `src/components/deals/WhyGoodDeal.tsx` - Auto-generated deal explanation from data
- `src/components/deals/HowToBook.tsx` - Numbered booking steps per program
- `src/components/deals/SimilarDeals.tsx` - 3 related deals (same destination or program)
- `src/components/deals/DealDetailDrawer.tsx` - Full detail panel with all 6 sections (Header, Pricing, Why Good, How to Book, Flight Details, Similar)

**Verify:** Render 6 DealCards on page, click to open drawer, verify all sections, test keyboard nav, verify responsive layout.

---

## Phase 3: Search Experience (~2-2.5h)

### 3.1 Hooks
- `src/hooks/useDebounce.ts` - Generic debounce (300ms for search inputs)
- `src/hooks/useURLState.ts` - Sync SearchState <-> URL query params via `replaceState`
- `src/hooks/useExperiment.ts` - Wraps experiment assignment as React hook
- **`src/hooks/useSearch.ts`** - Main search orchestrator: manages SearchState, calls dealService, handles cache/loading/error, updates URL, fires analytics. Initialized from URL params. Default sort from A/B experiment.

### 3.2 Search UI Components
- `src/components/ui/Chip.tsx` - Selectable chip with dark theme styling
- `src/components/ui/RangeSlider.tsx` - Styled range input with label + formatted value
- `src/components/ui/Toggle.tsx` - Switch toggle (`role="switch"`)
- `src/components/search/AirportAutocomplete.tsx` - Debounced input with dropdown, ARIA combobox pattern, "Anywhere" support
- `src/components/search/MonthSelector.tsx` - Pill group, multi-select + "Flexible" option
- `src/components/search/ProgramFilter.tsx` - Chip group for 7 programs + "All"
- `src/components/search/CabinSelector.tsx` - Single-select chip group
- `src/components/search/ActiveFilters.tsx` - Max points slider, min CPP slider, nonstop toggle, quality chips
- `src/components/search/SortControls.tsx` - Sort dropdown/chips
- `src/components/search/ResultsSummary.tsx` - "23 deals found · 8 Great Deals" with `aria-live="polite"`
- `src/components/search/CacheStatusBar.tsx` - Cache freshness label + live timer + refresh button with rotation animation
- `src/components/search/SearchBar.tsx` - Combines all search inputs, responsive layout

**Verify:** Full search flow - type origin, autocomplete works, results load with skeleton, cache works on repeat search, filters update instantly, URL reflects state, shareable URL restores state, error state triggers on ~5% of fetches.

---

## Phase 4: Dashboard (~1.5-2h)

### 4.1 State Management
- `src/hooks/useSettings.ts` - localStorage CRUD for UserSettings + isPro flag
- `src/hooks/useSavedDeals.ts` - localStorage CRUD for saved deals, returns `savedDealIds` Set
- `src/hooks/useRecentlyViewed.ts` - Ordered array of last 6 viewed deal IDs
- `src/contexts/AppContext.tsx` - Central context composing all hooks + active tab + selected deal state

### 4.2 Dashboard Components
- `src/components/dashboard/PreferenceChips.tsx` - Editable preference summary (airports, programs, cabin)
- `src/components/dashboard/RecommendedDeals.tsx` - 4 personalized deals via scoring algorithm + "See all →"
- `src/components/dashboard/TrendingDeals.tsx` - 4 popular deals sorted by popularityScore + "See all →"
- `src/components/dashboard/RecentlyViewed.tsx` - Last 6 clicked, horizontal scroll mobile, grid desktop
- `src/components/dashboard/SavedDealsPreview.tsx` - Top 3 saved + "View all saved (N) →"
- `src/components/dashboard/PointsBalanceCard.tsx` - Per-program balance with color accent, clickable to filter search
- `src/components/dashboard/TravelGoalTracker.tsx` - Progress bar toward points goal

**Verify:** Dashboard greeting with time-of-day, Recommended shows JFK-origin deals higher, Trending shows different deals, Recently Viewed populates after clicking deals, Points Balances display correctly, Travel Goal shows 75%.

---

## Phase 5: Saved Deals + Settings (~1h)

- `src/components/saved/SavedDealsList.tsx` - Full saved deals view with sort (date/value), remove (X button desktop, swipe mobile), badge count, empty state
- `src/components/settings/SettingsForm.tsx` - All settings from PRD 5.10: display name, home airports (multi-select autocomplete), preferred programs (checkboxes), cabin (radio), travel style (radio), flexibility (toggle), points balances (number inputs), notification toggles (mock). Auto-save on change.

**Verify:** Change settings → dashboard recommendations update. Save/remove deals. Empty states when no saved deals.

---

## Phase 6: Paywall + Experiment (~45min)

- `src/components/subscriber/PricingToggle.tsx` - Monthly ($9.99) / Annual ($79.99, "Save 33%") toggle
- `src/components/subscriber/PaywallGate.tsx` - After 5 results: gradient overlay, blurred cards behind, upgrade card with purple border, "Start Free Trial" CTA → success animation → isPro set → all results revealed
- `src/components/subscriber/UpgradeBanner.tsx` - Header CTA for free users / Pro badge for upgraded
- `src/components/layout/Footer.tsx` - Portfolio note + experiment variant badge

Wire A/B experiment: variant determines default sort in useSearch. `deal_saved` events include experiment_variant.

**Verify:** First 5 results clear, 6+ blurred, paywall card shows, upgrade flow works, Pro badge appears, experiment badge in footer.

---

## Phase 7: App Shell + Polish + Deploy (~1-1.5h)

### 7.1 Layout Components
- `src/components/layout/Header.tsx` - "DealDrop" logo, greeting, points summary, upgrade/pro badge
- `src/components/layout/TabNavigation.tsx` - 4 tabs with icons, bottom bar mobile, top bar desktop, saved count badge
- `src/components/layout/AppShell.tsx` - Composes Header + Tabs + Content + Footer + DealDetailDrawer

### 7.2 Final Assembly - `src/app/page.tsx`
- `'use client'`, AppProvider wrapper, AppShell rendering, tab-based content switching, URL hash for tab persistence

### 7.3 Polish Checklist
- Responsive audit at 3 breakpoints (mobile <640, tablet 640-1024, desktop >1024)
- Accessibility: keyboard nav, focus rings, focus trap in drawer, ARIA labels, `prefers-reduced-motion`, 44px touch targets
- Animations: card hover, save heart, drawer slide, skeleton shimmer, cache refresh spin, paywall blur
- Dark theme consistency across all components

### 7.4 Deploy
```bash
npm run build  # Verify no TS errors
# Deploy to Vercel
```

### 7.5 README.md
- Project overview, tech stack, how to run, architecture, "How This Maps to Daily Drop" table from PRD Section 19

**Verify:** Full walkthrough of all 17 success criteria (PRD Section 18). Lighthouse >90 performance & accessibility. Mobile device test. Shareable URLs work.

---

## File Manifest (~65 files total)

| Phase | Count | Files |
|-------|-------|-------|
| 1 | 11 + scaffold | types, constants, formatters, dealScoring, recommendationScoring, analytics, experiment, mockDeals, cacheService, dealService |
| 2 | 16 | SkeletonLoader, Badge, Tooltip, EmptyState, ErrorState, DealBadge, PointsComparison, DealCardSkeleton, DealCard, DealGrid, Drawer, CppTooltip, WhyGoodDeal, HowToBook, SimilarDeals, DealDetailDrawer |
| 3 | 16 | useDebounce, useURLState, useExperiment, useSearch, AirportAutocomplete, Chip, MonthSelector, ProgramFilter, CabinSelector, RangeSlider, Toggle, ActiveFilters, SortControls, ResultsSummary, CacheStatusBar, SearchBar |
| 4 | 11 | useSettings, useSavedDeals, useRecentlyViewed, AppContext, PreferenceChips, RecommendedDeals, TrendingDeals, RecentlyViewed, SavedDealsPreview, PointsBalanceCard, TravelGoalTracker |
| 5 | 2 | SavedDealsList, SettingsForm |
| 6 | 4 | PricingToggle, PaywallGate, UpgradeBanner, Footer |
| 7 | 5 | Header, TabNavigation, AppShell, page.tsx (final), README.md |

---

## Risk Mitigation

1. **Mock data volume** - Use route templates with generator function to expand into 55+ deals efficiently
2. **Drawer complexity** - Build desktop slide-from-right first, adapt mobile bottom sheet via CSS breakpoints
3. **URL sync conflicts** - URL is source of truth on initial load only; React state drives after that, URL updated as side effect
4. **localStorage + SSR hydration** - All localStorage reads in `useEffect`, initialize with defaults to avoid mismatch
5. **Time pressure** - Phases ordered by demo impact. If tight: simplify Dashboard (skip Recently Viewed, Travel Goal), simplify Paywall (just blur, no animation)
