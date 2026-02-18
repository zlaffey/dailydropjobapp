# Product Requirements Document: DealDrop — Points Deal Search & Subscriber Dashboard

**Version:** 2.0
**Author:** Zack Laffey
**Date:** February 18, 2026
**Status:** Ready for Build

---

## 1. Executive Summary

DealDrop is a portfolio prototype that demonstrates frontend engineering skills aligned to the Frontend Software Engineer role at Daily Drop. It is a points-based travel deal search engine wrapped in a personalized subscriber dashboard — the exact product surface Daily Drop builds every day.

The application will be built in a single day with AI assistance using React + TypeScript, and deployed to Vercel as a live, shareable URL. The goal is not to replicate Daily Drop's product, but to demonstrate the same _class_ of frontend thinking their team ships: complex data rendered simply, polished UX, product instinct, analytics-mindedness, and technical craft.

---

## 2. Strategic Alignment to Job Description

| JD Ownership Area                             | How This Prototype Covers It                                                                                                     |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Deal Discovery & Search Interfaces**        | Core search with filters, sorting, deal scoring, cached results with visible freshness indicators, and scannable card layout     |
| **Editorial & Subscriber Experiences**        | Subscriber dashboard with personalized recommendations, trending deals, saved deals, recently viewed, and a paywall gate         |
| **Analytics, Experimentation & Optimization** | Analytics event stubs, one live A/B experiment (sort default), conversion-oriented paywall UX                                    |
| **Technical Craft & Collaboration**           | Clean component architecture, mocked API service layer, TypeScript throughout, accessibility, responsive design, documented code |

---

## 3. User Personas

### 3a. Primary: "Busy Deal Seeker" (Sarah)

- **Who:** 28–40, travels 2–4x/year, has 1–2 credit cards with points but doesn't optimize them
- **Goal:** Find out if her 80,000 Chase points can get her to Japan without paying $1,200 cash
- **Behavior:** Searches by destination first, then compares points options. Skims quickly. Wants a clear "is this a good deal?" signal. Saves deals to revisit later.
- **Frustration:** Most points tools are either too complex (spreadsheets, forums) or too vague ("points are valuable!")

### 3b. Secondary: "Points Optimizer" (Marcus)

- **Who:** 35–50, churns credit cards, knows his cpp (cents per point) targets by program
- **Goal:** Scan new deals fast, filter to his preferred programs, find outlier value
- **Behavior:** Uses filters aggressively. Sorts by value. Doesn't need hand-holding — wants density and speed.
- **Frustration:** Slow UIs, unnecessary clicks, deals that bury the actual points price

### 3c. Tertiary: "Returning Subscriber" (Priya)

- **Who:** Any age, has been using the app for a few weeks, checks it daily
- **Goal:** See personalized recommendations instantly, check on saved deals, discover trending deals
- **Behavior:** Lands on the dashboard, scans recommendations, checks recently viewed deals, opens search if nothing jumps out
- **Frustration:** Generic homepages that don't remember her. Hard paywalls with no preview.

---

## 4. Information Architecture

```
DealDrop App
├── Header
│   ├── Logo / App Name
│   ├── Greeting ("Good morning, Sarah 👋")
│   ├── Points Balance Summary (subscriber)
│   └── Upgrade to Pro CTA (if free tier)
│
├── Tab Navigation
│   ├── 🏠 Dashboard (default for returning users)
│   ├── 🔍 Search
│   ├── 💾 Saved Deals
│   └── ⚙️ Settings
│
├── Dashboard Tab
│   ├── Preference Summary Chips
│   │   └── Home airport(s), preferred programs, cabin class
│   ├── Recommended Deals (personalized via scoring algorithm)
│   │   └── "Based on your preferences" · "See all →"
│   ├── Trending Deals (popularity-based, not personalized)
│   │   └── "Popular with DealDrop users" · "See all →"
│   ├── Recently Viewed Deals
│   │   └── Horizontal scroll, last 6 clicked
│   ├── Saved Deals Preview
│   │   └── Top 3 saved + "View all saved →"
│   ├── Travel Goal Tracker
│   │   └── Progress bar: "Japan Trip — 60,000 / 80,000 Chase UR (75%)"
│   └── Quick Actions
│       └── "Search deals" · "Update preferences"
│
├── Search Tab
│   ├── Search Bar
│   │   ├── Origin (autocomplete)
│   │   ├── Destination (autocomplete, supports "Anywhere")
│   │   ├── Month Selector (current + 11 months, multi-select, or "Flexible")
│   │   └── Points Program Filter (multi-select chips)
│   │
│   ├── Cache Status Bar
│   │   └── "Showing cached results · Updated 12 min ago" + [Refresh] button
│   │
│   ├── Active Filters Bar
│   │   ├── Max Points (range slider)
│   │   ├── Min CPP (range slider)
│   │   ├── Nonstop Only (toggle)
│   │   ├── Cabin Class (chips: Economy / Premium / Business / First)
│   │   ├── Deal Quality (chips: Great / Good / All)
│   │   └── Clear All
│   │
│   ├── Sort Controls
│   │   ├── Best Value — default (A/B tested, see §5.8)
│   │   ├── Lowest Points
│   │   ├── Lowest Cash Price
│   │   └── Soonest Departure
│   │
│   ├── Results Summary
│   │   └── "23 deals found · 8 Great Deals"
│   │
│   ├── Deal Cards (list)
│   │   └── [DealCard component — see §5.2]
│   │
│   ├── Paywall Gate (after 5 results for free users)
│   │   ├── Blurred deal cards behind
│   │   ├── "Unlock 18 more deals with DealDrop Pro"
│   │   └── Upgrade CTA with pricing toggle
│   │
│   ├── Empty State
│   │   └── Illustration + "No deals match your filters" + suggestions
│   │
│   └── Error State
│       └── "Something went wrong loading deals" + [Retry] button
│
├── Saved Deals Tab
│   ├── Saved deal cards (from localStorage)
│   ├── Sort by: Date Saved / Best Value
│   ├── Remove functionality (swipe on mobile, X on desktop)
│   └── Empty state: "Save deals from Search to track them here"
│
├── Settings Tab
│   ├── Display Name
│   ├── Home Airport(s) (multi-select autocomplete)
│   ├── Preferred Points Programs (checkboxes)
│   ├── Cabin Preference (radio: Economy / Premium / Business / First)
│   ├── Travel Style (radio: Budget / Comfort / Luxury)
│   ├── Flexibility (toggle: Fixed month / Flexible dates)
│   ├── Points Balances (number input per program)
│   └── Notification Preferences (mock toggles)
│
└── Footer
    └── "Built as a frontend engineering portfolio piece · View source"
```

---

## 5. Core Feature Specifications

### 5.1 Deal Search Engine

**Purpose:** Let users search for travel deals by route and see points redemption options ranked by value.

**Search Inputs:**

| Field          | Type                       | Behavior                                                                                    |
| -------------- | -------------------------- | ------------------------------------------------------------------------------------------- |
| Origin         | Text input w/ autocomplete | Matches against airport codes + city names. Debounced (300ms). Top 5 suggestions.           |
| Destination    | Text input w/ autocomplete | Same as origin. Supports "Anywhere" as wildcard.                                            |
| Month          | Pill selector or dropdown  | Current month + next 11 months. Multi-select allowed. "Flexible" option returns all months. |
| Points Program | Multi-select chips         | Chase UR, Amex MR, Capital One, Citi TY, United, Delta, AA. "All" default.                  |
| Cabin          | Chip group                 | Economy / Premium Economy / Business / First. "All" default.                                |

**Search Behavior:**

- Results filter in real time on every input change (no "Search" button needed — live filtering against mock dataset via the service layer)
- URL updates with query params: `?from=JFK&to=NRT&month=2026-06&cabin=business&programs=chase,amex`
- Shareable URLs restore full search state
- Initial load shows skeleton cards during simulated API delay (400–900ms)
- Subsequent identical queries return cached results instantly with a visible freshness label

**Filters (post-search refinement):**

| Filter       | Type                                        | Default         |
| ------------ | ------------------------------------------- | --------------- |
| Max Points   | Range slider (0–200k)                       | 200k (no limit) |
| Min CPP      | Range slider (0–3.0¢)                       | 0 (no limit)    |
| Nonstop Only | Toggle                                      | Off             |
| Deal Quality | Chip group: Great / Good / All              | All             |
| Cabin Class  | Chips: Economy / Premium / Business / First | All             |

**Sorting:**

| Sort Option                              | Logic                                               |
| ---------------------------------------- | --------------------------------------------------- |
| Best Value (default — see A/B test §5.8) | Highest cents-per-point, weighted by deal freshness |
| Lowest Points                            | Ascending points cost                               |
| Lowest Cash Price                        | Ascending cash equivalent                           |
| Soonest Departure                        | Ascending by travel month                           |

---

### 5.2 Deal Card Component

The deal card is the most important UI element in the app. It must be scannable in under 2 seconds.

**Visual Layout (desktop):**

```
┌──────────────────────────────────────────────────────────┐
│  [🔥 GREAT DEAL]                              ♡ Save    │
│                                                          │
│  JFK → NRT                                               │
│  New York → Tokyo Narita                                 │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Chase UR     │  │ Amex MR      │  │ Cash Price   │   │
│  │ 60,000 pts   │  │ 80,000 pts   │  │ $1,247       │   │
│  │ + $86 fees   │  │ + $86 fees   │  │              │   │
│  │ 2.08¢/pt ✦   │  │ 1.56¢/pt     │  │              │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                          │
│  Jun 2026 · Nonstop · Business · ANA                     │
│  Updated 2 hours ago                                     │
└──────────────────────────────────────────────────────────┘
```

**Deal Score Badge Logic:**

| Badge         | Color             | Icon      | Rule                        |
| ------------- | ----------------- | --------- | --------------------------- |
| 🔥 GREAT DEAL | Green (`#16a34a`) | Flame     | Best program cpp ≥ 1.8¢     |
| ✅ GOOD DEAL  | Blue (`#2563eb`)  | Checkmark | Best program cpp 1.3¢–1.79¢ |
| ➖ FAIR       | Gray (`#6b7280`)  | Dash      | Best program cpp < 1.3¢     |

Note: Color is never the sole indicator. Badges always include both icon + text label for accessibility.

**Cents-per-point calculation:**

```
cpp = (cashPriceCents) / pointsRequired
```

The highest-value program option gets a ✦ indicator.

**Card interactions:**

- **Hover (desktop):** subtle elevation (`translateY(-2px)`) + border color shift, 150ms ease
- **Click/tap:** opens Deal Detail Drawer (see §5.3)
- **Save button:** heart icon toggles, persists to localStorage, fires `deal_saved` analytics event, brief scale animation (300ms spring)
- **Keyboard:** Tab to focus → Enter to open detail → S to save/unsave

**Responsive behavior:**

- Desktop (>1024px): 2-column card grid
- Tablet (640–1024px): single column, horizontal card layout
- Mobile (<640px): stacked vertical cards, program options scroll horizontally

---

### 5.3 Deal Detail Drawer

**Purpose:** Give users full context on a deal so they can decide whether to act.

**Trigger:** Clicking/tapping any deal card.

**Layout:** Slides in from the right on desktop (480px wide panel). Full-screen bottom sheet on mobile.

**Sections:**

**A. Header**

- Route: "JFK → NRT"
- Full airport names
- Deal badge (Great / Good / Fair)
- Save toggle

**B. Points & Pricing Comparison**

- Full program options table:
  | Program | Points | Taxes & Fees | CPP | |
  |---|---|---|---|---|
  | Chase UR | 60,000 | $86 | 2.08¢ | ✦ Best Value |
  | Amex MR | 80,000 | $86 | 1.56¢ | |
  | United Miles | 75,000 | $86 | 1.65¢ | |
- Cash price comparison: "$1,247 round trip"
- CPP explanation tooltip: "Cents per point measures how much value you get from each point. Higher is better. Anything above 1.5¢ is considered good."

**C. Why This Is a Good Deal**
Auto-generated from deal data:

- "This business class fare to Tokyo normally costs $4,000+. At 60,000 Chase UR points, you're getting 2.08¢ per point — well above the 1.5¢ average."
- Logic: template string that fills in route, cabin, cpp, and comparison to average

**D. How to Book**
Static template with program-specific steps:

1. "Log in to Chase Ultimate Rewards"
2. "Transfer 60,000 points to ANA Mileage Club"
3. "Search for JFK → NRT on ANA's website"
4. "Select the business class award ticket"
5. "Pay $86 in taxes and fees"

**E. Flight Details**

- Airline: ANA
- Cabin: Business
- Nonstop / 1 stop
- Travel window: June 2026
- Last updated: 2 hours ago

**F. Similar Deals**

- 3 deal cards matching same destination OR same program
- Helps user explore without going back to search

**Interactions:**

- Close: X button, Escape key, or click outside (desktop)
- Swipe down to close (mobile)
- Deep link: URL updates to `?deal=deal_123` so the detail can be shared

---

### 5.4 Cached Search UX

**Purpose:** Demonstrate understanding of cached search — a pattern Daily Drop explicitly calls out in the job description.

**How it works:**

1. **First search** for a given query → simulated network delay (400–900ms random) → skeleton loading → results appear
2. **Cache key** = serialized, sorted query params: `origin:JFK|destination:NRT|month:2026-06|programs:chase,amex`
3. **Cache storage** = in-memory Map + localStorage snapshot for persistence across tab refreshes
4. **Cache entry** stores:
   ```typescript
   interface CacheEntry {
   	key: string;
   	results: Deal[];
   	timestamp: number; // Date.now()
   	ttl: number; // 15 minutes in ms
   }
   ```
5. **Repeat search** with same params → results return instantly (no skeleton) → cache status bar shows:
   - "Showing cached results · Updated 12 min ago" + [Refresh] button
6. **Refresh button** → clears cache for that key → triggers fresh fetch with simulated delay → new timestamp
7. **Stale cache** (>15 min) → auto-refresh on next query, with a subtle "Refreshing..." indicator

**Visual treatment:**

- Cache status bar sits between the search inputs and results
- Uses a muted background (`#f0f9ff`) with a clock icon
- "12 min ago" updates in real time (via `setInterval`)
- Refresh button has a rotate animation on click

---

### 5.5 Subscriber Dashboard

**Purpose:** Give subscribers a personalized home base that surfaces relevant deals and tracks their points portfolio.

**Preference Summary Chips:**

- Displayed at the top of the dashboard
- Shows: home airport(s), preferred programs, cabin class
- Each chip is tappable → links to Settings
- "Edit preferences →" link

**Recommended Deals Section:**

Title: "Recommended for you"
Subtitle: "Based on your preferences"

Uses the recommendation scoring algorithm (see §7.3) to rank deals:

| Factor                      | Points | Logic                                        |
| --------------------------- | ------ | -------------------------------------------- |
| Origin matches home airport | +40    | Exact match on any home airport              |
| Program matches preference  | +20    | Any intersection with preferred programs     |
| Cabin matches preference    | +15    | Exact match on cabin preference              |
| Nonstop flight              | +10    | Boolean bonus                                |
| Popularity score            | +0–15  | Scaled from deal's `popularityScore` (0–100) |

Shows top 4 deals. "See all →" navigates to Search with user's preferences pre-loaded as filters.

**Trending Deals Section:**

Title: "Trending deals"
Subtitle: "Popular with DealDrop users"

Sorted by `popularityScore` descending. This is explicitly _not_ personalized — it shows what's broadly popular, giving the dashboard two distinct content strategies.

Shows top 4 deals. "See all →" navigates to Search sorted by popularity.

**Recently Viewed:**

- Last 6 deals the user clicked into (Deal Detail Drawer)
- Stored in localStorage as an ordered array of deal IDs
- Horizontal scroll on mobile, 3-column grid on desktop
- Empty state: "Start exploring deals to see your recent activity here."

**Saved Deals Preview:**

- Top 3 most recently saved deals
- "View all saved (7) →" links to Saved tab
- Empty state: "Save deals from Search to track them here."

**Points Balance Cards:**

- One card per configured program
- Shows: program name + color, current balance, trend arrow (mock)
- Tapping a card filters Search to that program
- Empty state: "Add your points balances in Settings →"

**Travel Goal Tracker:**

- User-defined trip name + target points + program
- Progress bar with percentage: "Japan Trip — 60,000 / 80,000 Chase UR (75%) 🟩🟩🟩⬜"
- Mock data pre-populated for demo

---

### 5.6 Saved Deals

**Purpose:** Let users bookmark deals to revisit later.

**Storage:** localStorage under key `dealdrop_saved_deals`

**Schema:**

```typescript
interface SavedDeal {
	id: string;
	savedAt: string; // ISO timestamp
	deal: Deal; // full deal object snapshot
}
```

**Behavior:**

- Same DealCard component as search results
- Sorted by `savedAt` descending (newest first), with option to sort by Best Value
- Remove: swipe-to-remove on mobile, X button on desktop
- Badge count on Saved tab shows number of saved deals
- Empty state: illustration + "Save deals from Search to track them here."

---

### 5.7 Paywall Gate

**Purpose:** Demonstrate understanding of subscriber conversion UX — a core part of the Daily Drop business model.

**Behavior:**

1. Free users see the first 5 search results clearly
2. Results 6+ render with `filter: blur(6px)` and `pointer-events: none`
3. A paywall banner overlays the blurred section:
   - Headline: "Unlock 18 more deals with DealDrop Pro"
   - Monthly/Annual toggle: `$9.99/mo` or `$79.99/yr` ("Save 33%")
   - CTA: "Start Free Trial"
   - Social proof: "Join 12,400+ deal hunters"
4. Clicking "Start Free Trial" → brief success animation → `isPro` set in localStorage → all results revealed → banner dismissed
5. A/B test–ready: paywall component accepts props for headline, pricing, and CTA text

**Visual treatment:**

- Semi-transparent gradient overlay fading from transparent to white over the blurred cards
- Paywall card has a subtle purple border (brand accent) and elevated shadow
- CTA button uses the primary brand color with hover state

---

### 5.8 A/B Experiment: Default Sort Order

**Purpose:** Demonstrate hands-on experimentation thinking — not just "A/B ready" architecture, but an actual running experiment.

**Hypothesis:** Users who see deals sorted by "Best Value" (CPP descending) will save more deals than users who see "Lowest Points" first, because value framing increases confidence.

**Implementation:**

```typescript
// lib/experiment.ts
type ExperimentVariant = "A" | "B";

interface Experiment {
	name: string;
	variants: Record<ExperimentVariant, string>;
	assignment: ExperimentVariant;
}

function getExperiment(name: string): Experiment {
	const stored = localStorage.getItem(`experiment_${name}`);
	if (stored) return JSON.parse(stored);

	// Random 50/50 assignment
	const assignment: ExperimentVariant = Math.random() < 0.5 ? "A" : "B";
	const experiment: Experiment = {
		name,
		variants: {
			A: "best_value", // Default sort = Best Value (CPP desc)
			B: "lowest_points", // Default sort = Lowest Points
		},
		assignment,
	};

	localStorage.setItem(`experiment_${name}`, JSON.stringify(experiment));
	return experiment;
}
```

**What the user sees:**

- Variant A: Search results default to "Best Value" sort
- Variant B: Search results default to "Lowest Points" sort
- A small, unobtrusive "🧪 Experiment: Variant [A/B]" badge in the footer (visible for demo purposes, would be hidden in production)

**Events tracked:**

- `experiment_assigned { experiment_name, variant }`
- `deal_saved { ..., experiment_variant }` (to measure the hypothesis)

---

### 5.9 Analytics Instrumentation

**Purpose:** Show that you think about measurement, not just pixels.

**Implementation:** A lightweight `track()` function that logs events to the console in dev and could be wired to any analytics provider in production.

```typescript
// lib/analytics.ts
type EventName =
	| "search_performed"
	| "deal_clicked"
	| "deal_saved"
	| "deal_unsaved"
	| "filter_applied"
	| "sort_changed"
	| "paywall_shown"
	| "paywall_cta_clicked"
	| "upgrade_completed"
	| "settings_updated"
	| "tab_switched"
	| "cache_hit"
	| "cache_refresh"
	| "deal_detail_opened"
	| "similar_deal_clicked"
	| "experiment_assigned";

interface EventProperties {
	[key: string]: string | number | boolean | undefined;
}

export function track(event: EventName, properties?: EventProperties): void {
	const payload = {
		event,
		properties,
		timestamp: new Date().toISOString(),
		sessionId: getSessionId(),
	};

	if (process.env.NODE_ENV === "development") {
		console.log(`[Analytics] ${event}`, payload);
	}
	// Production: window.analytics?.track(event, properties);
}
```

**Key instrumentation points:**

| Event                 | When Fired                              | Key Properties                                                                            |
| --------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------- |
| `search_performed`    | On each search state change (debounced) | `origin, destination, month, programs, result_count, cache_hit`                           |
| `deal_clicked`        | User opens deal detail drawer           | `deal_id, origin, destination, position_in_list, deal_quality, source (search/dashboard)` |
| `deal_saved`          | User saves a deal                       | `deal_id, origin, destination, best_program, cpp, experiment_variant`                     |
| `filter_applied`      | Any filter changes                      | `filter_name, filter_value, result_count_after`                                           |
| `sort_changed`        | Sort order changes                      | `sort_by, result_count`                                                                   |
| `cache_hit`           | Cached results served                   | `cache_key, cache_age_seconds`                                                            |
| `cache_refresh`       | User manually refreshes cache           | `cache_key, previous_age_seconds`                                                         |
| `paywall_shown`       | Paywall gate enters viewport            | `deals_visible, deals_hidden, search_query`                                               |
| `paywall_cta_clicked` | User clicks upgrade CTA                 | `plan_type (monthly/annual), source`                                                      |
| `deal_detail_opened`  | Deal drawer opens                       | `deal_id, source (search/dashboard/saved)`                                                |
| `tab_switched`        | Navigation tab changes                  | `from_tab, to_tab`                                                                        |
| `experiment_assigned` | User enters experiment                  | `experiment_name, variant`                                                                |

---

### 5.10 Settings / Preferences

**Purpose:** Capture user preferences that drive personalization, recommendation scoring, and default search behavior.

| Setting                  | Input Type                | Options                                                    | Default     |
| ------------------------ | ------------------------- | ---------------------------------------------------------- | ----------- |
| Display Name             | Text input                | Free text                                                  | "Traveler"  |
| Home Airport(s)          | Multi-select autocomplete | Airport codes                                              | —           |
| Preferred Programs       | Checkbox group            | Chase UR, Amex MR, Capital One, Citi TY, United, Delta, AA | All checked |
| Cabin Preference         | Radio group               | Economy, Premium Economy, Business, First                  | Economy     |
| Travel Style             | Radio group               | Budget, Comfort, Luxury                                    | Comfort     |
| Date Flexibility         | Toggle                    | Fixed month / Flexible dates                               | Flexible    |
| Points Balances          | Number inputs per program | 0–999,999                                                  | 0           |
| Notification Preferences | Toggle group (mock)       | Deal alerts, Price drops, Weekly digest                    | All on      |

**Persistence:** localStorage under `dealdrop_settings`

**Impact on app:**

- Dashboard greeting uses Display Name
- Dashboard recommendations scored using home airports + preferred programs + cabin + style
- Search form pre-populates origin from home airport(s)
- Deal cards highlight user's preferred programs with a subtle accent
- Travel Style affects deal scoring (luxury users see Business/First weighted higher in recommendations)
- Points balances power the Travel Goal Tracker and balance cards

---

### 5.11 Error State

**Purpose:** Show production resilience thinking. Real APIs fail — the UI should handle it gracefully.

**Implementation:**

- 5% chance on any "fresh" search (non-cached) that the mock API returns an error
- Error state replaces results area:
  - Icon: warning triangle
  - Headline: "Something went wrong loading deals"
  - Body: "We couldn't fetch the latest results. This might be a temporary issue."
  - CTA: [Try Again] button → retriggers the search
  - Secondary: "Or try a different search"
- Cached results are never affected by errors (if a cache entry exists, serve it even if refresh fails, with a note: "Showing cached results. Live refresh failed.")

---

## 6. Component Architecture

```
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx              # Header + Tabs + Content area
│   │   ├── Header.tsx                # Logo, greeting, points summary, upgrade CTA
│   │   ├── TabNavigation.tsx         # Bottom tabs (mobile) / top tabs (desktop)
│   │   └── Footer.tsx                # Portfolio note + experiment badge
│   │
│   ├── search/
│   │   ├── SearchBar.tsx             # Origin + Destination + Month + Program + Cabin
│   │   ├── AirportAutocomplete.tsx   # Debounced autocomplete input
│   │   ├── MonthSelector.tsx         # Pill group with multi-select
│   │   ├── ProgramFilter.tsx         # Multi-select chip group
│   │   ├── CabinSelector.tsx         # Chip group
│   │   ├── ActiveFilters.tsx         # Max points, min CPP, nonstop, deal quality
│   │   ├── SortControls.tsx          # Dropdown or chip group
│   │   ├── ResultsSummary.tsx        # "23 deals found · 8 Great Deals"
│   │   └── CacheStatusBar.tsx        # "Cached · 12 min ago" + Refresh
│   │
│   ├── deals/
│   │   ├── DealCard.tsx              # The core card component
│   │   ├── DealDetailDrawer.tsx      # Slide-in panel with full deal info
│   │   ├── DealBadge.tsx             # Great / Good / Fair badge (icon + text)
│   │   ├── PointsComparison.tsx      # Program options within a card
│   │   ├── CppTooltip.tsx            # Explains cents-per-point
│   │   ├── WhyGoodDeal.tsx           # Auto-generated deal explanation
│   │   ├── HowToBook.tsx             # Static booking steps template
│   │   ├── SimilarDeals.tsx          # 3 related deals
│   │   ├── DealGrid.tsx              # Responsive grid wrapper
│   │   └── DealCardSkeleton.tsx      # Loading placeholder
│   │
│   ├── subscriber/
│   │   ├── PaywallGate.tsx           # Blurred results + upgrade CTA
│   │   ├── UpgradeBanner.tsx         # Header CTA for free users
│   │   └── PricingToggle.tsx         # Monthly / Annual switch
│   │
│   ├── dashboard/
│   │   ├── PreferenceChips.tsx       # Editable preference summary
│   │   ├── RecommendedDeals.tsx      # Personalized via scoring algorithm
│   │   ├── TrendingDeals.tsx         # Popularity-based (not personalized)
│   │   ├── RecentlyViewed.tsx        # Last 6 clicked deals
│   │   ├── SavedDealsPreview.tsx     # Top 3 + "View all"
│   │   ├── PointsBalanceCard.tsx     # Per-program balance display
│   │   └── TravelGoalTracker.tsx     # Progress bar toward goal
│   │
│   ├── saved/
│   │   ├── SavedDealsList.tsx
│   │   └── EmptyState.tsx
│   │
│   ├── settings/
│   │   └── SettingsForm.tsx
│   │
│   └── ui/
│       ├── Badge.tsx
│       ├── Chip.tsx
│       ├── Toggle.tsx
│       ├── RangeSlider.tsx
│       ├── Tooltip.tsx
│       ├── Drawer.tsx                # Reusable slide-in panel
│       ├── BottomSheet.tsx           # Mobile drawer variant
│       ├── EmptyState.tsx
│       ├── ErrorState.tsx
│       └── SkeletonLoader.tsx
│
├── services/
│   ├── dealService.ts                # Mock API: search, trending, recommended, getById
│   ├── cacheService.ts              # Cache key generation, storage, TTL management
│   └── types.ts                      # Service response types
│
├── hooks/
│   ├── useSearch.ts                  # Search state, filtering, sorting, cache integration
│   ├── useSavedDeals.ts             # localStorage CRUD for saved deals
│   ├── useSettings.ts               # localStorage CRUD for settings
│   ├── useRecentlyViewed.ts         # Track viewed deals
│   ├── useDebounce.ts               # Debounced input values
│   ├── useURLState.ts               # Sync search params with URL
│   └── useExperiment.ts             # A/B test assignment + tracking
│
├── lib/
│   ├── analytics.ts                  # track() function
│   ├── experiment.ts                 # Experiment assignment logic
│   ├── dealScoring.ts               # CPP calculation, badge logic
│   ├── recommendationScoring.ts     # Preference-based ranking algorithm
│   ├── formatters.ts                # formatPoints(), formatCurrency(), formatTimeAgo()
│   └── constants.ts                  # Programs, airports, cabin classes, CPP thresholds
│
├── data/
│   └── mockDeals.ts                  # 50+ realistic mock deals
│
├── types/
│   └── index.ts                      # Deal, Airport, Program, Settings, etc.
│
└── app/
    └── page.tsx                      # Single-page app entry
```

---

## 7. Data Model

### 7.1 Core Types

```typescript
// types/index.ts

type PointsProgram =
	| "chase_ur"
	| "amex_mr"
	| "capital_one"
	| "citi_ty"
	| "united"
	| "delta"
	| "american";

type CabinClass = "economy" | "premium_economy" | "business" | "first";

type DealQuality = "great" | "good" | "fair";

interface Airport {
	code: string; // "JFK"
	city: string; // "New York"
	name: string; // "John F. Kennedy International"
}

interface ProgramOption {
	program: PointsProgram;
	pointsRequired: number;
	taxesFeesUsd: number; // e.g., 86.00
	centsPerPoint: number; // calculated
	transferPartner?: string; // e.g., "ANA" for Chase UR
	bookingSteps?: string[]; // program-specific booking instructions
}

interface Deal {
	id: string;
	origin: Airport;
	destination: Airport;
	regionTags: string[]; // e.g., ["Asia", "East Asia"]
	programOptions: ProgramOption[];
	cashPrice: number; // in USD
	cabin: CabinClass;
	airline: string;
	isNonstop: boolean;
	travelMonth: string; // "2026-06"
	dateStart?: string; // ISO, for sample dates
	dateEnd?: string; // ISO
	updatedAt: string; // ISO timestamp
	bestCpp: number; // pre-calculated highest cpp
	quality: DealQuality; // derived from bestCpp thresholds
	popularityScore: number; // 0–100, drives Trending section
	notes?: string; // e.g., "Book directly on ANA website"
}

interface UserSettings {
	displayName: string;
	homeAirports: Airport[]; // multi-select
	preferredPrograms: PointsProgram[];
	cabinPreference: CabinClass;
	travelStyle: "budget" | "comfort" | "luxury";
	dateFlexibility: "fixed" | "flexible";
	pointsBalances: Partial<Record<PointsProgram, number>>;
}

interface SavedDeal {
	id: string;
	savedAt: string;
	deal: Deal;
}

interface TravelGoal {
	id: string;
	name: string;
	program: PointsProgram;
	targetPoints: number;
	notes?: string;
}

interface SearchState {
	origin: string;
	destination: string;
	months: string[];
	programs: PointsProgram[];
	cabin: CabinClass | "all";
	maxPoints: number;
	minCpp: number;
	nonstopOnly: boolean;
	dealQuality: DealQuality | "all";
	sortBy: "best_value" | "lowest_points" | "lowest_cash" | "soonest";
}

interface CacheEntry {
	key: string;
	results: Deal[];
	timestamp: number;
	ttl: number; // 15 minutes default
}

interface SearchResponse {
	deals: Deal[];
	cacheStatus: "fresh" | "cached";
	cachedAt?: number;
	totalCount: number;
}
```

### 7.2 CPP Calculation

```typescript
function calculateCpp(cashPriceUsd: number, pointsRequired: number): number {
	if (pointsRequired === 0) return 0;
	return (cashPriceUsd * 100) / pointsRequired; // returns cents
}
```

### 7.3 Deal Quality Thresholds

| Badge    | CPP Range    | Rationale                                             |
| -------- | ------------ | ----------------------------------------------------- |
| 🔥 Great | ≥ 1.8¢       | Exceptional value — well above average transfer value |
| ✅ Good  | 1.3¢ – 1.79¢ | Solid redemption — beats cash in most cases           |
| ➖ Fair  | < 1.3¢       | Marginal — might be better to pay cash                |

These thresholds are defined as constants and can be tuned.

### 7.4 Recommendation Scoring Algorithm

```typescript
function scoreRecommendation(deal: Deal, settings: UserSettings): number {
	let score = 0;

	// +40 if origin matches any home airport
	if (settings.homeAirports.some((a) => a.code === deal.origin.code)) {
		score += 40;
	}

	// +20 if any deal program matches user's preferred programs
	const dealPrograms = deal.programOptions.map((o) => o.program);
	if (dealPrograms.some((p) => settings.preferredPrograms.includes(p))) {
		score += 20;
	}

	// +15 if cabin matches preference
	if (deal.cabin === settings.cabinPreference) {
		score += 15;
	}

	// +10 if nonstop
	if (deal.isNonstop) {
		score += 10;
	}

	// +0–15 scaled by popularity
	score += Math.round((deal.popularityScore / 100) * 15);

	return score;
}
```

---

## 8. Mocked API Service Layer

**Purpose:** Structure data access like a real application would — through a service layer with simulated network behavior. This demonstrates how you'd collaborate with backend engineers and how the frontend would integrate with real APIs.

```typescript
// services/dealService.ts

const SIMULATED_DELAY_MS = { min: 400, max: 900 };
const ERROR_RATE = 0.05; // 5% chance of simulated failure

async function simulateNetwork<T>(data: T): Promise<T> {
	const delay =
		Math.random() * (SIMULATED_DELAY_MS.max - SIMULATED_DELAY_MS.min) +
		SIMULATED_DELAY_MS.min;
	await new Promise((resolve) => setTimeout(resolve, delay));

	if (Math.random() < ERROR_RATE) {
		throw new Error("Network error: failed to fetch deals");
	}

	return data;
}

export async function searchDeals(
	params: SearchState,
): Promise<SearchResponse> {
	const cacheKey = buildCacheKey(params);
	const cached = cacheService.get(cacheKey);

	if (cached && !cached.isStale) {
		track("cache_hit", { cache_key: cacheKey, cache_age_seconds: cached.age });
		return {
			deals: cached.results,
			cacheStatus: "cached",
			cachedAt: cached.timestamp,
			totalCount: cached.results.length,
		};
	}

	// Simulate fresh fetch
	const filtered = filterAndSortDeals(mockDeals, params);
	const results = await simulateNetwork(filtered);

	cacheService.set(cacheKey, results);

	return {
		deals: results,
		cacheStatus: "fresh",
		totalCount: results.length,
	};
}

export async function getTrendingDeals(limit = 4): Promise<Deal[]> {
	const sorted = [...mockDeals].sort(
		(a, b) => b.popularityScore - a.popularityScore,
	);
	return sorted.slice(0, limit);
}

export async function getRecommendedDeals(
	settings: UserSettings,
	limit = 4,
): Promise<Deal[]> {
	const scored = mockDeals.map((deal) => ({
		deal,
		score: scoreRecommendation(deal, settings),
	}));
	scored.sort((a, b) => b.score - a.score);
	return scored.slice(0, limit).map((s) => s.deal);
}

export async function getDealById(id: string): Promise<Deal | null> {
	return mockDeals.find((d) => d.id === id) || null;
}
```

---

## 9. Mock Data Requirements

### 9.1 Airports (20+)

**US Hubs:** JFK, LAX, ORD, SFO, MIA, DFW, SEA, BOS, ATL, DEN, IAH, DCA
**International:** NRT, HND, LHR, CDG, FCO, BCN, CUN, SJO, HNL, SYD, BKK, ICN, SIN

### 9.2 Deals (50+)

Distribute across:

- 6+ US origins
- 12+ destinations (mix of domestic and international)
- All cabin classes (weighted: 40% economy, 30% business, 20% premium economy, 10% first)
- All 7 points programs
- 8+ travel months
- Mix of nonstop (60%) and connecting (40%)
- Each deal has 2–4 program options with different point costs and taxes

**Realistic pricing ranges:**

| Cabin           | Cash Price     | Points Range | Taxes/Fees | Typical CPP |
| --------------- | -------------- | ------------ | ---------- | ----------- |
| Economy         | $300–$1,500    | 15k–80k      | $5–$60     | 0.8¢–2.5¢   |
| Premium Economy | $600–$2,500    | 30k–100k     | $20–$80    | 0.9¢–2.8¢   |
| Business        | $2,000–$8,000  | 50k–120k     | $50–$200   | 1.2¢–3.5¢   |
| First           | $5,000–$15,000 | 80k–180k     | $80–$300   | 1.5¢–4.0¢   |

**Popularity scores:** distributed 0–100 with a few "viral" deals at 85+ to make Trending interesting.

### 9.3 Default User Settings (Pre-populated for Demo)

```json
{
	"displayName": "Sarah",
	"homeAirports": [
		{
			"code": "JFK",
			"city": "New York",
			"name": "John F. Kennedy International"
		}
	],
	"preferredPrograms": ["chase_ur", "amex_mr"],
	"cabinPreference": "economy",
	"travelStyle": "comfort",
	"dateFlexibility": "flexible",
	"pointsBalances": {
		"chase_ur": 82400,
		"amex_mr": 45000,
		"capital_one": 23000
	}
}
```

---

## 10. Interaction Design Details

### 10.1 Search Flow

1. User lands on Dashboard (default tab for returning users) or Search (for new users)
2. On Search tab: mock API is called with default params → skeleton cards shown during 400–900ms delay
3. Results appear with count summary: "23 deals found · 8 Great Deals"
4. User types in Origin → autocomplete dropdown after 1 character, debounced 300ms
5. Each input change triggers the service layer → cache check → instant (if cached) or delayed (if fresh)
6. Cache status bar shows freshness: "Showing cached results · Updated 12 min ago [Refresh]"
7. URL updates silently via `replaceState` — no page reload
8. After 5 results, free users see the paywall gate
9. 5% of fresh fetches trigger error state with retry

### 10.2 Deal Card → Detail Flow

1. Card is visible in grid → shows summary (route, best points option, badge, cash price, taxes)
2. Hover (desktop): card elevates, border shifts, 150ms ease
3. Click/tap: Deal Detail Drawer slides in from right (desktop) or up as bottom sheet (mobile)
4. Drawer shows full comparison table, "Why this is good," "How to book," similar deals
5. URL updates to `?deal=deal_123`
6. Close: X button, Escape key, click outside, or swipe down (mobile)
7. Deal is added to Recently Viewed in localStorage

### 10.3 Paywall Interaction

1. User scrolls past 5th result
2. 6th+ results render with blur + `pointer-events: none`
3. Paywall banner appears over blurred results
4. Monthly/Annual toggle: price updates with smooth transition, "Save 33%" badge on annual
5. "Start Free Trial" → success animation → `isPro` set → all results revealed
6. If already Pro: no paywall, all results visible, Pro badge in header

### 10.4 Empty States

| Context            | Message                                                          | Action              |
| ------------------ | ---------------------------------------------------------------- | ------------------- |
| No search results  | "No deals match your filters. Try broadening your search."       | [Clear all filters] |
| No saved deals     | "Save deals from Search to track them here."                     | [Search deals →]    |
| No recently viewed | "Start exploring deals to see your recent activity."             | [Search deals →]    |
| No points balances | "Add your points balances in Settings to see personalized info." | [Update Settings →] |

### 10.5 Error State

| Context                        | Message                                                                | Action                                     |
| ------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------ |
| Search API failure             | "Something went wrong loading deals. This might be a temporary issue." | [Try Again] + "Or try a different search"  |
| Refresh failure (cache exists) | "Showing cached results. Live refresh failed."                         | [Try Again] with stale cache still visible |

---

## 11. Visual Design Direction

### 11.1 Design Principles

1. **Scannable:** Users should identify the best deal in under 2 seconds
2. **Trustworthy:** Clean, professional aesthetic — feels like a premium financial tool
3. **Delightful without being cute:** Subtle animations, not playful ones
4. **Information-dense without clutter:** Lots of data, clear hierarchy
5. **Confidence-building:** Badges, explanations, and consistent labels help users trust their decisions

### 11.2 Color System

| Token              | Value                 | Usage                                |
| ------------------ | --------------------- | ------------------------------------ |
| `--brand-primary`  | `#1e40af` (deep blue) | Headers, CTAs, active states         |
| `--brand-accent`   | `#7c3aed` (purple)    | Pro badge, upgrade elements, paywall |
| `--deal-great`     | `#16a34a` (green)     | Great Deal badge + card accent       |
| `--deal-good`      | `#2563eb` (blue)      | Good Deal badge                      |
| `--deal-fair`      | `#6b7280` (gray)      | Fair badge                           |
| `--surface`        | `#ffffff`             | Card backgrounds                     |
| `--surface-muted`  | `#f9fafb`             | Page background                      |
| `--surface-cache`  | `#f0f9ff`             | Cache status bar background          |
| `--border`         | `#e5e7eb`             | Card borders, dividers               |
| `--text-primary`   | `#111827`             | Headings, primary text               |
| `--text-secondary` | `#6b7280`             | Metadata, labels                     |
| `--text-accent`    | `#7c3aed`             | Pro, upgrade text                    |

### 11.3 Typography

- **Font family:** Inter (system fallback: `-apple-system, BlinkMacSystemFont, sans-serif`)
- **Headings:** 600 weight
- **Body:** 400 weight
- **Points numbers:** 700 weight, `font-variant-numeric: tabular-nums` for column alignment
- **Scale:** 14px base, modular scale 1.2
- **CPP values:** monospace variant for precise alignment in comparison tables

### 11.4 Spacing

- 4px base unit
- Card padding: 16px (mobile), 24px (desktop)
- Card gap: 12px (mobile), 16px (desktop)
- Section spacing: 32px
- Tab content padding: 16px (mobile), 32px (desktop)

### 11.5 Motion

- Card hover: `transform: translateY(-2px)` + `box-shadow` grow, 150ms ease
- Tab switch: content crossfade, 200ms ease
- Filter toggle: 150ms ease
- Save heart: `scale(1.2) → scale(1)`, 300ms spring curve
- Deal drawer: `translateX(100%) → translateX(0)`, 250ms ease-out (desktop); `translateY(100%) → translateY(0)` (mobile)
- Skeleton shimmer: linear gradient sweep, 1.5s linear infinite
- Cache refresh icon: `rotate(360deg)`, 600ms ease on click
- Paywall blur: `filter: blur(0) → blur(6px)`, 300ms ease

---

## 12. Accessibility Requirements

| Requirement         | Implementation                                                                                                                                                                                                        |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keyboard navigation | All interactive elements focusable and operable via keyboard                                                                                                                                                          |
| Focus management    | Visible focus rings (2px offset, brand color). Focus trapped inside Deal Detail Drawer when open. Return focus to trigger element on close.                                                                           |
| Screen reader       | Semantic HTML (`nav`, `main`, `section`, `article`). ARIA labels on icon-only buttons (e.g., "Save deal", "Close drawer"). `aria-live="polite"` on results count and cache status. `role="status"` on loading states. |
| Color independence  | Deal badges use icon + text, never color alone. Error states use icon + text.                                                                                                                                         |
| Color contrast      | All text meets WCAG AA (4.5:1 body, 3:1 large text)                                                                                                                                                                   |
| Reduced motion      | `prefers-reduced-motion` media query disables all transitions and animations                                                                                                                                          |
| Touch targets       | Minimum 44×44px for all tappable elements on mobile                                                                                                                                                                   |
| Alt text            | Decorative images marked `aria-hidden="true"`. Informational content has descriptive labels.                                                                                                                          |
| Form labels         | All inputs have visible labels or `aria-label`. Autocomplete dropdowns use `aria-expanded`, `aria-activedescendant`.                                                                                                  |

---

## 13. Performance Targets

| Metric                      | Target          | How                                               |
| --------------------------- | --------------- | ------------------------------------------------- |
| First Contentful Paint      | < 1s            | Static build, minimal JS bundle                   |
| Time to Interactive         | < 2s            | Code-split tabs, lazy-load non-active tab content |
| Cached search response      | < 50ms          | In-memory cache, no re-render of unchanged data   |
| Fresh search response       | 400–900ms       | Simulated delay (production-realistic)            |
| Filter/sort update          | < 50ms          | `useMemo` on filtered/sorted arrays               |
| Deal card render (50 items) | < 16ms          | Virtualized list or paginate at 20 items          |
| Lighthouse Performance      | > 90            | Optimized assets, minimal dependencies            |
| Bundle size                 | < 150kb gzipped | Tree-shaking, no heavy libraries, Tailwind purge  |

---

## 14. Responsive Breakpoints

| Breakpoint              | Layout Changes                                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mobile** (<640px)     | Single column. Bottom tab bar. Stacked card layout. Program options horizontal scroll. Full-width search inputs. Deal detail as bottom sheet.                       |
| **Tablet** (640–1024px) | Single column cards. Side-by-side search inputs. Tab bar at top. Deal detail as side drawer.                                                                        |
| **Desktop** (>1024px)   | 2-column card grid. Top tab bar. Search inputs in single row. Filters in collapsible panel. Deal detail as right-side drawer (480px). Dashboard in 2–3 column grid. |

---

## 15. State Management Plan

**Approach:** React hooks + Context. No external state library — this scope doesn't need one.

| State                     | Location                      | Persistence                           |
| ------------------------- | ----------------------------- | ------------------------------------- |
| Search query/filters      | `useSearch` hook + URL params | URL (shareable)                       |
| Search results            | Returned from `dealService`   | In-memory cache + localStorage backup |
| Cache entries             | `cacheService`                | In-memory Map + localStorage          |
| Saved deals               | `useSavedDeals` hook          | localStorage                          |
| User settings             | `useSettings` hook            | localStorage                          |
| Recently viewed           | `useRecentlyViewed` hook      | localStorage                          |
| Active tab                | `useState` in AppShell        | URL hash                              |
| isPro flag                | `useSettings` hook            | localStorage                          |
| Expanded deal (drawer)    | `useState` in parent          | URL param (`?deal=id`)                |
| A/B experiment assignment | `useExperiment` hook          | localStorage                          |
| Loading / error states    | `useSearch` hook              | None (transient)                      |

---

## 16. Scope Control

### ✅ In Scope (Day 1 Build)

- Full search + filter + sort experience with mocked API service layer
- Visible cache layer with freshness indicator and manual refresh
- Deal cards with scoring, badges, program comparison, and taxes/fees
- Deal Detail Drawer with "Why this is good," "How to book," and similar deals
- Save/unsave deals with localStorage
- Subscriber dashboard with Recommended (personalized) and Trending (popularity) sections
- Recently viewed + saved deals preview on dashboard
- Points balance cards and travel goal tracker
- Settings page with preferences that drive personalization scoring
- Paywall gate with simulated upgrade and pricing toggle
- One live A/B experiment (default sort order)
- Analytics event stubs with structured console logging
- Simulated error states with retry
- URL-based search state (shareable)
- Skeleton loading states
- Empty states for all sections
- Responsive design (mobile, tablet, desktop)
- Keyboard accessibility + ARIA labels
- Clean TypeScript throughout
- Deploy to Vercel with live URL

### ❌ Out of Scope

- Real API / backend / database
- Authentication / user accounts
- Real payment processing
- Server-side rendering (static React / Next.js export is fine)
- Real push notifications
- Email template rendering
- Native mobile app (Ionic)
- Full editorial CMS
- Automated tests (but component structure should be testable)
- CI/CD pipeline
- Dark mode (nice-to-have stretch goal)

---

## 17. Build Plan (Recommended Order)

| Phase | Milestone                  | Time Estimate | Deliverable                                                                                                                                        |
| ----- | -------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1** | **Foundation**             | 1–1.5h        | Next.js setup, types, mock data (50+ deals), service layer with cache + simulated delay, analytics stub, experiment module                         |
| **2** | **Deal Card + Detail**     | 1.5–2h        | DealCard component (the hero), DealBadge, PointsComparison (with taxes), DealDetailDrawer with all sections, DealCardSkeleton                      |
| **3** | **Search Experience**      | 2–2.5h        | SearchBar with autocomplete, filters, sort, CacheStatusBar, ResultsSummary, error state, URL sync, integration with service layer                  |
| **4** | **Dashboard**              | 1.5–2h        | Recommended deals (with scoring algorithm), Trending deals, Recently viewed, Saved preview, Points balances, Travel Goal Tracker, Preference chips |
| **5** | **Saved Deals + Settings** | 1h            | SavedDealsList, SettingsForm, localStorage integration, preference-driven personalization wiring                                                   |
| **6** | **Paywall + Experiment**   | 45m           | PaywallGate with blur + pricing toggle + simulated upgrade, A/B experiment wiring for default sort                                                 |
| **7** | **Polish + Deploy**        | 1–1.5h        | Responsive pass, accessibility audit, empty/error states, motion/animation, Vercel deploy, README                                                  |

**Total estimated time: 9–12 hours** (aggressive but achievable with AI assistance)

---

## 18. Success Criteria

This prototype succeeds if a reviewer (the Daily Drop hiring team) can:

1. **Land on the Dashboard** and immediately see personalized deal recommendations that feel relevant
2. **Distinguish Recommended from Trending** and understand they use different logic
3. **Search for a deal** and immediately identify which redemption option is the best value
4. **See the cache in action** — search, navigate away, search the same route again, and see instant cached results with a freshness label
5. **Hit Refresh** and watch the app simulate a real network fetch with loading state
6. **Apply filters** and see results update instantly with no jank
7. **Open a Deal Detail Drawer** and understand _why_ the deal is good and _how_ to book it
8. **Share a search URL** and have it restore the exact search state including the open deal
9. **Save a deal** and find it on both the Dashboard preview and the Saved tab
10. **Hit the paywall** and understand the value proposition clearly enough to want to "upgrade"
11. **Resize the browser** from desktop to mobile and see a polished layout at every width
12. **Tab through the interface** with a keyboard and never get lost
13. **Open the browser console** and see structured analytics events firing on every interaction
14. **Notice the A/B experiment badge** and understand that sort behavior is being tested
15. **Encounter an error state** and see a graceful recovery with retry
16. **Read the code** and see clean TypeScript, a logical service layer, and a clear component architecture
17. **Feel** that this was built by someone who understands Daily Drop's product, their users, and what production frontend craft looks like

---

## 19. README: "How This Maps to Daily Drop"

Include this section in the repository README:

| Daily Drop JD Callout                                                           | DealDrop Implementation                                                     |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| "Build fast, trustworthy search and browsing experiences"                       | Full search with filters, sort, cached results, and scannable deal cards    |
| "Points search and cached search"                                               | Mocked API with visible cache layer, freshness labels, and manual refresh   |
| "Present complex data in ways that feel simple, scannable, and actionable"      | Deal cards with CPP calculation, value badges, and program comparison       |
| "Iterate on UI patterns that help users make confident decisions quickly"       | "Why this is a good deal" explanations, CPP tooltips, booking steps         |
| "Subscriber experiences more personalized"                                      | Recommendation scoring algorithm, preference-driven dashboard, travel goals |
| "Content, offers, and recommendations are surfaced across the customer journey" | Recommended + Trending + Recently Viewed + Saved across Dashboard           |
| "Frontend instrumentation and experimentation frameworks"                       | Analytics event stubs + live A/B experiment on sort default                 |
| "Test hypotheses, measure outcomes, and iterate"                                | Experiment with variant assignment, tracked metrics, visible badge          |
| "Translate ambiguous product ideas into clear frontend architectures"           | Clean component tree, service layer, hook-based state management            |
| "Collaborate closely with backend engineers to define APIs"                     | Mocked service layer that mirrors real API contract patterns                |
| "Frontend standards, component libraries, documentation"                        | Typed components, shared UI primitives, documented architecture             |
| "How value is communicated and experienced in the UI"                           | Paywall gate with pricing toggle, social proof, and simulated upgrade       |
