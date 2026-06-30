/**
 * cPanel Node.js App deployment script.
 * Run via cPanel Git Version Control after each push,
 * or manually: node deploy-build.js
 *
 * cPanel Node.js App settings:
 *   Node.js version : 20
 *   App root        : repositories/chrsd-websitev2
 *   App startup file: dist/server/entry.mjs
 *   App URL         : /  (or /admin if proxied)
 */

const { execSync } = require('child_process');
const path = require('path');

const repoDir = '/home/chrsdorg/repositories/chrsd-websitev2';

console.log('Installing dependencies…');
execSync('npm ci --legacy-peer-deps', { cwd: repoDir, stdio: 'inherit' });

console.log('Building…');
execSync('npm run build', {
  cwd: repoDir,
  stdio: 'inherit',
  env: { ...process.env },
});

console.log(`
✓ Build complete.

Next steps in cPanel → Setup Node.js App:
  App root        : repositories/chrsd-websitev2
  App startup file: dist/server/entry.mjs
  Node.js version : 20

Environment variables to add in the Node.js App panel:
  DATABASE_URL    = postgresql://postgres:...@db....supabase.co:5432/postgres
  HOST            = 0.0.0.0
  PORT            = (assigned by cPanel automatically)

Click "Restart" in the Node.js App panel after first setup.
`);
