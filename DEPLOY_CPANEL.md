# Deploying to cPanel (Node.js App)

## One-time setup in cPanel

### 1. Git Version Control
- cPanel → Git Version Control → Clone a Repository
- Clone URL: `https://github.com/chrsdfoundation/chrsd.git`
- Repository path: `repositories/chrsd-websitev2`
- Branch: `claude/chrsd-admin-panel-corrections-jsq8x3` (or `main` after merge)

### 2. Setup Node.js App
- cPanel → Setup Node.js App → Create Application
- **Node.js version**: 20
- **Application mode**: Production
- **Application root**: `repositories/chrsd-websitev2`
- **Application URL**: `/` (root of chrsd.org)
- **Application startup file**: `dist/server/entry.mjs`

### 3. Environment variables (in the Node.js App panel)
Add these under "Environment Variables":

```
DATABASE_URL=postgresql://postgres:8Dv2WR%23%25he%2Bf.ac@db.zpsjfivzpvhgnvlelhmh.supabase.co:5432/postgres
CERT_SIGNATORY_NAME=Executive Director
CERT_SIGNATORY_TITLE=CHRSD Foundation
HOST=0.0.0.0
```

### 4. Build & start
- Click **Run NPM Install** in the Node.js App panel
- Then in Terminal: `cd repositories/chrsd-websitev2 && npm run build`
- Back in Node.js App panel: click **Restart**

### 5. Subsequent deploys
- Git Version Control → pull latest
- Terminal: `cd repositories/chrsd-websitev2 && npm run build`
- Node.js App panel: **Restart**

## Admin panel
After deploy: `https://chrsd.org/admin/login`
- Email: ed@chrsd.org
- Password: (as set during setup)
