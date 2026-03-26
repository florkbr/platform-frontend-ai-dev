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

### Verification for UI changes

When the ticket involves visual/UI changes:

1. **Start the dev server**: Run the project's dev server (usually `npm run start` or `npm run dev`). The app will be available at `https://stage.foo.redhat.com:1337/`.

2. **Take a "before" screenshot**: Before your changes, use the browser MCP to navigate to the affected page and take a screenshot.

3. **Take an "after" screenshot**: After your changes, restart the dev server if needed, navigate to the same page, and take another screenshot.

4. **Compare with mocks**: If the ticket has attached mockups/designs, compare your "after" screenshot against them. Make sure the implementation matches the design.

5. **Upload screenshots to the PR**: Attach the before/after screenshots to the pull request body or as a comment so reviewers can see the visual diff.

6. **Stop the dev server** when done.

### Verification for non-UI changes
- Use the browser MCP to check the UI at `https://stage.foo.redhat.com:1337/` and verify your changes don't break anything visually if the ticket includes reproduction steps.
