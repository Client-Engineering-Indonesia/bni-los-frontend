# BNI LOS Frontend - VM Deployment Guide

## Quick Deploy

Run the automated deployment script:

```bash
cd ~/bni-los-frontend/bni-los-webapp_v1
chmod +x rehost.sh
./rehost.sh
```

---

## Manual Deployment Steps

### 1. Connect to VM

```bash
ssh -i /path/to/pem_ibmcloudvsi_download_3.pem itzuser@52.116.129.247 -p 2223
```

### 2. Navigate to Project Directory

```bash
cd ~/bni-los-frontend/bni-los-webapp_v1
```

### 3. Pull Latest Changes

```bash
git pull origin main
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Build Application

```bash
npm run build
```

### 6. Start Application on Port 8080

```bash
PORT=8080 npm run preview
```

Or for production with PM2:

```bash
pm2 start npm --name "bni-los-webapp" -- run preview -- --port 8080
pm2 save
```

---

## Rehosting (Update & Restart)

To update and restart the application:

```bash
cd ~/bni-los-frontend/bni-los-webapp_v1
./rehost.sh
```

Or manually:

```bash
# Stop existing process
pm2 stop bni-los-webapp

# Pull latest code
git pull origin main

# Install any new dependencies
npm install

# Rebuild application
npm run build

# Restart application
pm2 restart bni-los-webapp

# View logs
pm2 logs bni-los-webapp
```

---

## Process Management with PM2

### Install PM2 (if not already installed)

```bash
npm install -g pm2
```

### Start Application

```bash
pm2 start npm --name "bni-los-webapp" -- run preview -- --port 8080
```

### View Status

```bash
pm2 status
```

### View Logs

```bash
pm2 logs bni-los-webapp
```

### Stop Application

```bash
pm2 stop bni-los-webapp
```

### Restart Application

```bash
pm2 restart bni-los-webapp
```

### Remove from PM2

```bash
pm2 delete bni-los-webapp
```

### Save PM2 Configuration

```bash
pm2 save
```

### Setup PM2 to Start on Boot

```bash
pm2 startup
# Follow the instructions provided
```

---

## Access Application

Once deployed, access the application at:

```
http://52.116.129.247:8080
```

Or if you have a domain name configured, use that instead.

---

## Troubleshooting

### Port Already in Use

If port 8080 is already in use:

```bash
# Find process using port 8080
lsof -i :8080

# Kill the process (replace PID with actual process ID)
kill -9 PID
```

### Application Not Starting

Check the logs:

```bash
pm2 logs bni-los-webapp --lines 100
```

### Git Pull Conflicts

If you have local changes conflicting with remote:

```bash
# Stash local changes
git stash

# Pull latest
git pull origin main

# Reapply local changes if needed
git stash pop
```

### Node Modules Issues

If you encounter dependency issues:

```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

---

## Environment Variables

The application uses the following configuration:

- **API Base URL**: Configured via Vite proxy (`/api` → `https://nds-webmethod.ngrok.dev:443/restv2`)
- **Port**: 8080 (configurable via `PORT` environment variable)

To modify the API endpoint, edit `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'https://nds-webmethod.ngrok.dev:443/restv2',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```
