---
name: production-release
description: Prepare a Cronomate release from dev to main, reviewing persisted model compatibility before updating the version, running local checks, and optionally testing locally with available browser tools. Never verify remote deployments.
---

# Cronomate Production Release

## Release order

Always follow this order:

**Models and migrations → package version → local validation → publish dev → promote to main → final report.**

Do not bump the package version before completing the model compatibility review.

## Project context

- Development branch: `dev`.
- Production branch: `main`.
- Development deployment: https://dev-cronomate.vercel.app/
- Production deployment: https://cronomate.vercel.app/
- Deployment platform: Vercel.
- Build command: `npm run build`; output directory: `dist`.
- Persisted session migrations: `src/shared/services/sessionStorageVersionConverter.ts`.
- Release version: `package.json`, synchronized with `package-lock.json`.
- Production must have `VITE_SHOW_DEV_TOOLS=false` or leave it unset; review configuration only, without accessing the deployed application.

## Workflow

### 1. Review persisted models and migrations

1. Inspect the working tree and branch. Preserve unrelated or uncommitted user work.
2. Refresh remote references when access is available. Compare the proposed release on `dev` with the current production code on `origin/main`, including its package version.
3. Compare persisted models, storage readers and writers, defaults, and the existing migration chain. Include current sessions, history, imported sessions, Pomodoro, and settings where affected.
4. If the persisted Session schema changed, add the required conversion and its `schemaMigrations` entry in `src/shared/services/sessionStorageVersionConverter.ts`. Follow the converter's existing conventions, including explicit field mapping rather than spread operators.
5. Preserve the existing migration chain and verify that saved data from the production version reaches the new schema without data loss. Cover older supported data as well.
6. If another persisted model changed, verify its loading/defaulting logic and provide a compatible migration when needed; the Session converter does not migrate every storage format.
7. If no persisted schema changed, explicitly record that no migration is required. Do not add an empty migration solely because the application version changes.

### 2. Update the package version

1. Agree on the target version with the user if it was not supplied.
2. After the compatibility review and any required migrations are complete, increment `package.json` and synchronize `package-lock.json`. For example:

   ```sh
   npm version <target-version> --no-git-tag-version
   ```

3. Ensure any migration introduced for this release targets the agreed release version. Existing migrations keep their original version boundaries.
4. Do not create a Git tag or release automatically unless requested.

### 3. Validate locally

Run:

```sh
npm test
npm run lint
npm run build
```

- Always run the local commands above, independently of browser-tool availability.
- Before attempting browser-based checks, determine whether Playwright or an equivalent browser automation tool is available in the current session.
- If a browser tool is available, test only the local application (normally `http://localhost:5555/`). Validate both a clean installation with no saved data and an upgrade using representative production-version fixtures. Check navigation, affected features, migrated sessions, history, settings, and persistence after reloading.
- Use isolated local test data; never read or overwrite real production user data during validation.
- If no browser tool is available, skip browser-based checks and continue the release workflow. Do not install or configure a browser tool merely to satisfy this step. Tool unavailability alone is not a release blocker, but it must be disclosed in the final report.
- Report failures and distinguish pre-existing issues from regressions. Do not silently skip checks or claim that a failing check passed. Resolve blockers or obtain an explicit decision before promoting the release.

### 4. Publish development

1. When authorized, commit the reviewed release changes and push `dev`.
2. Vercel handles the development deployment. Do not open the remote development application or inspect its deployment status; validation is local only.

### 5. Promote to production

1. When authorized, create a pull request with **base `main` and head `dev`**.
2. Include the version, migration decision, validation results, and any known issues in the pull request.
3. Review and merge the pull request only with user authorization and after required checks pass. Do not force-push, bypass protections, or push directly to `main`.
4. Vercel handles production deployment from `main`. Do not open production, run production smoke tests, inspect deployment status, or attempt remote verification.

### 6. Report results

1. Report the release version, migration outcome, local command results, and authorized Git operations completed.
2. State whether local browser checks were performed and summarize their results. If no browser tool was available, explicitly report: **Local browser checks skipped: Playwright or an equivalent tool was unavailable.**
3. List any failures, skipped checks, or remaining issues. Clearly state that remote development and production deployments were not verified, as required by this workflow. Never claim deployment success based solely on a push or merge.

## Scope and authorization

Creating or editing this skill does not authorize executing a release. When the skill is invoked, perform only the release stages requested by the user. Ask before committing, pushing, creating a pull request, merging, or triggering a production deployment unless that action was explicitly authorized.
