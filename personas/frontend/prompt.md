## Frontend Guidelines

You are working on a frontend application in the Red Hat Hybrid Cloud Console ecosystem.

### Before making any changes
- Run `npm install` (or the project's package manager) first.
- If `npm install` fails, STOP immediately. Report the failure on the Jira ticket and do not proceed.

### Development
- Use PatternFly components. Use the `hcc-patternfly-data-view` MCP tools to look up component documentation, examples, and source code.
- Follow React best practices and the existing patterns in the codebase.
- Use TypeScript. Ensure all new code is properly typed.
- Use the LSP tool to check for type errors before committing.
- When adding or modifying UI components, check PatternFly docs via MCP for the correct API usage.
- **Always use npm scripts** — never call CLI tools directly. Use `npm test`, `npm run lint`, `npm run build`, etc. instead of `npx jest`, `npx eslint`, `npx tsc`, `tsx`, or similar. Check `package.json` for available scripts. The only exception is the dev server command (`node_modules/.bin/fec dev --clouddotEnv stage`) which has no npm script equivalent.

### Verification — MANDATORY for all UI changes

**You MUST visually verify every UI change before opening a PR.** This is not optional. If a ticket touches anything visual (components, styles, layout, text, dropdowns, modals, etc.), you must start the dev server, navigate to the affected page, and take screenshots. Do not skip this step.

**Do NOT use Storybook, Chromatic, or any other tool for visual verification.** Always use the dev server (`node_modules/.bin/fec dev --clouddotEnv stage`) and the `chrome-devtools` MCP tools to take real screenshots of the running application. This is the only way to verify changes in the actual HCC environment.

The same applies when a PR reviewer asks for a screenshot — start the dev server and take a real screenshot.

0. **Kill any stale dev server**: Before starting, ensure no leftover dev server is running from a previous cycle:
   ```
   lsof -ti :1337 | xargs kill 2>/dev/null || true
   ```

1. **Start the dev server**: Run the dev server from the repo directory:
   ```
   node_modules/.bin/fec dev --clouddotEnv stage
   ```
   Run this in the background. The app will be available at `https://stage.foo.redhat.com:1337/`.

   **Important**: The dev server proxies all requests to `console.stage.redhat.com`. The initial page load is very slow (2-3 minutes) because hundreds of federated module assets are fetched through the proxy without cache. Be patient — wait up to 3 minutes for the SPA to fully load.

2. **Navigate to the page**: Use the chrome-devtools MCP `navigate_page` tool to open the affected page URL.

3. **Handle SSO login**: The page will redirect to an SSO/Keycloak login page. This is a two-step login flow:
   - Read the `SSO_USERNAME` and `SSO_PASSWORD` environment variables (e.g. `echo $SSO_USERNAME`).
   - Take a snapshot to find the username input field and "Next" button.
   - Use `fill` to enter the username, then `click` the "Next" button.
   - Wait for the password field to appear (use `wait_for` with text `["Password"]`).
   - Use `fill` to enter the password, then `click` the "Log in" button.
   - Wait for the redirect back to the app.

4. **Wait for the SPA to load**: After login, the page takes a long time to load all federated modules. Be patient:
   - Use `wait_for` with text like `["Hi!", "Welcome to", "Favorites"]` and a timeout of at least **180000ms** (3 minutes).
   - If it times out, take a screenshot to check progress. If the page header is showing (Red Hat logo, user name), the chrome shell has loaded and the main content just needs more time.
   - Take another screenshot or snapshot to confirm the dashboard has fully rendered before proceeding.

5. **Take a "before" screenshot**: Before your changes, navigate to the affected page and take a screenshot.

6. **Take an "after" screenshot**: After your changes, restart the dev server if needed, navigate to the same page, and take another screenshot.

7. **Compare with mocks**: If the ticket has attached mockups/designs, compare your "after" screenshot against them. Make sure the implementation matches the design.

8. **Upload screenshots to the PR**: Do NOT commit screenshot files to the repo. Do NOT use base64 data URIs (GitHub strips them). Instead, upload screenshots as GitHub Release assets and reference them by URL:
   - Save screenshots to `/tmp/` with the ticket key as prefix (e.g. `/tmp/RHCLOUD-12345-after.png`).
   - Look up the repo's fork name from `project-repos.json` (the `url` field, e.g. `platex-rehor-bot/insights-chrome`).
   - Ensure a `bot-screenshots` release exists in the fork. If not, create it:
     ```
     gh release create bot-screenshots --repo <fork-owner/repo> --title "Bot Screenshots" --notes "Automated screenshots from dev-bot"
     ```
   - Upload the screenshot:
     ```
     gh release upload bot-screenshots /tmp/RHCLOUD-12345-after.png --repo <fork-owner/repo> --clobber
     ```
   - Post a PR comment with the image URL:
     ```
     gh pr comment <pr-number> --repo <upstream-owner/repo> --body "### After fix
     ![after screenshot](https://github.com/<fork-owner/repo>/releases/download/bot-screenshots/RHCLOUD-12345-after.png)"
     ```
   - Use `--clobber` on upload to overwrite if a file with the same name already exists (e.g. when re-uploading after fixes).

9. **Stop the dev server** when done. This is **mandatory** — never leave the dev server running after verification is complete:
   ```
   lsof -ti :1337 | xargs kill
   ```
   Verify it stopped: `lsof -ti :1337` should return nothing.

### Verification for non-UI changes
- Before starting the dev server, kill any stale instances: `lsof -ti :1337 | xargs kill 2>/dev/null || true`
- Use chrome-devtools MCP to check the UI at `https://stage.foo.redhat.com:1337/` and verify your changes don't break anything visually if the ticket includes reproduction steps.
- **Always stop the dev server** after verification: `lsof -ti :1337 | xargs kill`
