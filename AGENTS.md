# Repository Guidelines

## Project Structure & Module Organization
This repository is a Next.js App Router project.

- `app/`: application routes and UI (`layout.js`, `page.js`, `globals.css`).
- `public/`: static assets (SVGs, icons) served from `/`.
- Root config: `next.config.mjs`, `eslint.config.mjs`, `postcss.config.mjs`, `jsconfig.json`.
- Product/context docs: `prd.md`, `plan.md`.

Keep route components close to their route segment under `app/`. Use the `@/*` import alias from `jsconfig.json` for shared modules.

## Build, Test, and Development Commands
- `npm run dev`: start local dev server at `http://localhost:3000`.
- `npm run build`: create a production build.
- `npm run start`: run the production server from the build output.
- `npm run lint`: run ESLint with Next.js Core Web Vitals rules.

Run `npm run lint` before opening a PR.

## Coding Style & Naming Conventions
- Language: JavaScript/JSX (App Router).
- Indentation: 2 spaces; keep files Prettier-friendly even if not explicitly configured.
- Components: PascalCase function names (example: `RootLayout`).
- Route files: Next.js conventions (`page.js`, `layout.js`).
- Styling: Tailwind CSS v4 utilities in JSX plus shared tokens in `app/globals.css`.
- Imports: prefer absolute alias imports (`@/...`) over deep relative paths when practical.

## Testing Guidelines
There is no test framework configured yet in this snapshot. Until one is added:

- Treat `npm run lint` as the required quality gate.
- For UI changes, verify manually in `npm run dev` across key states (desktop/mobile, light/dark where applicable).
- If you add tests, colocate them near source files and use `*.test.js` naming.

## Commit & Pull Request Guidelines
No local Git history is available in this workspace snapshot, so follow a clear default:

- Commit format: imperative, concise subject (example: `Add hero CTA section`).
- Keep commits focused to one logical change.
- PRs should include: purpose, user-visible impact, validation steps (`npm run lint`, manual checks), and screenshots for UI updates.
- Link related issue(s) when available.
