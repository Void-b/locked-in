# TODO: Fix Render Deployment Warnings

## Completed
- [x] Added engines field to package.json for Node >=18.18.0 and npm >=9.0.0
- [x] Updated Next.js to ^14.2.15
- [x] Updated eslint-config-next to ^14.2.15
- [x] Deleted node_modules and package-lock.json locally
- [x] Ran npm install to reinstall dependencies with updated versions
- [x] Fixed TypeScript errors in lib/rateLimit.ts and scripts/export.ts
- [x] Removed invalid experimental.appDir from next.config.js
- [x] Tested build locally with npm run build - build succeeds without warnings or errors

## Pending
- [ ] Commit the changes to git
- [ ] In Render dashboard, change the build command from "vercel build" to "npm run build"
- [ ] Redeploy on Render
- [ ] Verify that the warnings are gone and build succeeds
