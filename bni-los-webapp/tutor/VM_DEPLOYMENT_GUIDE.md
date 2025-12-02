# BNI LOS - VM Deployment Guide

Complete step-by-step guide to deploy the BNI LOS application to your IBM Cloud VM.

---

## Prerequisites

- VM IP: `52.116.129.247`
- SSH Port: `2223`
- SSH Key: `pem_ibmcloudvsi_download_3.pem`
- User: `itzuser`
- Target Directory: `~/BNI_V2/bni-los-frontend/bni-los-webapp`
- Server Port: `8080`

---

## Step 1: Prepare Application on Local Machine

### 1.1 Navigate to Project Directory
```bash
cd /Users/raishira/Downloads/BNI_LOS_FE
```

### 1.2 Compress the Application
```bash
tar -czf bni-los-webapp-updated.tar.gz bni-los-webapp/
```

**What this does**: Creates a compressed archive of your entire application (around 31MB).

---

## Step 2: Upload to VM

### 2.1 Upload Compressed File
```bash
scp -i /Users/raishira/Downloads/BNI_LOS_FE/pem_ibmcloudvsi_download_3.pem \
    -P 2223 \
    /Users/raishira/Downloads/BNI_LOS_FE/bni-los-webapp-updated.tar.gz \
    itzuser@52.116.129.247:~/
```

**Expected output**: 
```
bni-los-webapp-updated.tar.gz    100%   31MB   4.3MB/s   00:07
```

---

## Step 3: Check Node.js Version (IMPORTANT!)

### 3.1 SSH into VM
```bash
ssh -i /Users/raishira/Downloads/BNI_LOS_FE/pem_ibmcloudvsi_download_3.pem \
    -p 2223 \
    itzuser@52.116.129.247
```

### 3.2 Check Current Node.js Version
```bash
node --version
```

**If version is less than v18.x.x, you MUST upgrade!**

---

## Step 4: Upgrade Node.js (If Needed)

### 4.1 Add NodeSource Repository
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```

**Expected output**: Repository configured successfully.

### 4.2 Remove Conflicting Package
```bash
sudo apt remove libnode-dev -y
```

### 4.3 Install Node.js 20
```bash
sudo apt install nodejs -y
```

**Expected output**: 
```
nodejs (20.19.6-1nodesource1) ...
Setting up nodejs (20.19.6-1nodesource1) ...
```

### 4.4 Verify Installation
```bash
node --version  # Should show v20.19.6 or higher
npm --version   # Should show v10.8.2 or higher
```

---

## Step 5: Deploy Application on VM

### 5.1 Stop Any Existing Process
```bash
pkill -f "npm run dev"
```

**Note**: This may show "No such process" if nothing is running - that's OK.

### 5.2 Navigate and Backup Old Version (If Exists)
```bash
cd ~/BNI_V2/bni-los-frontend
```

**Backup old version (optional but recommended):**
```bash
if [ -d "bni-los-webapp" ]; then
    mv bni-los-webapp bni-los-webapp-backup-$(date +%Y%m%d_%H%M%S)
fi
```

### 5.3 Extract New Version
```bash
tar -xzf ~/bni-los-webapp-updated.tar.gz
```

### 5.4 Navigate to Application Directory
```bash
cd bni-los-webapp
```

---

## Step 6: Configure Vite for Port 8080

### 6.1 Update Vite Configuration
```bash
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Bind to all interfaces (allows external access)
    port: 8080,       // Use port 8080
    strictPort: true  // Fail if port is already in use
  }
})
EOF
```

**What this does**: 
- Sets server to listen on all network interfaces (`0.0.0.0`)
- Configures port 8080
- Enables strict port mode

---

## Step 7: Install Dependencies

### 7.1 Install npm Packages
```bash
npm install
```

**Expected output**:
```
added 1 package, and audited 210 packages in 696ms

55 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

**If you see warnings about unsupported engine, that's okay as long as it completes.**

---

## Step 8: Handle Port Conflicts (If Needed)

### 8.1 Check if Port 8080 is in Use
```bash
sudo lsof -i :8080
```

### 8.2 Kill Process Using Port 8080 (If Needed)
```bash
sudo fuser -k 8080/tcp
```

**Wait 2-3 seconds for the port to be released:**
```bash
sleep 2
```

---

## Step 9: Start the Application

### 9.1 Start with nohup (Background Process)
```bash
nohup npm run dev > nohup.out 2>&1 &
```

**What this does**:
- `nohup` - Keeps process running after you disconnect
- `npm run dev` - Starts Vite development server
- `> nohup.out` - Redirects output to log file
- `2>&1` - Redirects errors to same log file
- `&` - Runs in background

### 9.2 Wait for Server to Start
```bash
sleep 5
```

---

## Step 10: Verify Deployment

### 10.1 Check Process is Running
```bash
ps aux | grep "npm run dev" | grep -v grep
```

**Expected output**:
```
itzuser   152270  2.4  0.3 1094156 56968 ?  Sl   06:34   0:00 npm run dev
```

### 10.2 Check Server Logs
```bash
tail -20 nohup.out
```

**Expected output**:
```
> bni-los-webapp@0.0.0 dev
> vite

  VITE v7.2.4  ready in 195 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://10.240.1.216:8080/
```

### 10.3 Verify Port is Listening
```bash
sudo lsof -i :8080
```

**Expected output**:
```
COMMAND    PID    USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    152283 itzuser   19u  IPv4 419019      0t0  TCP *:http-alt (LISTEN)
```

---

## Step 11: Access Your Application

### 11.1 From Your Browser
Open your web browser and navigate to:

```
http://52.116.129.247:8080
```

### 11.2 Test Features
1. **Login Page** - Should show role dropdown and password field
2. **New Application** - Should have all new fields (PKS, Banking Info, etc.)
3. **Operations Dashboard** - Should have PKS Companies tab
4. **Money Formatting** - Should display as Rp 100.000.000

---

## Server Management Commands

### View Real-Time Logs
```bash
ssh -i /Users/raishira/Downloads/BNI_LOS_FE/pem_ibmcloudvsi_download_3.pem \
    -p 2223 \
    itzuser@52.116.129.247

cd ~/BNI_V2/bni-los-frontend/bni-los-webapp
tail -f nohup.out
```

Press `Ctrl+C` to stop viewing logs (server keeps running).

### Stop the Server
```bash
pkill -f "npm run dev"
```

### Restart the Server
```bash
cd ~/BNI_V2/bni-los-frontend/bni-los-webapp
pkill -f "npm run dev"
nohup npm run dev > nohup.out 2>&1 &
```

### Check Server Status
```bash
ps aux | grep "npm run dev" | grep -v grep
```

### Check Which Port is Being Used
```bash
sudo lsof -i :8080
```

---

## Troubleshooting

### Issue: Port 8080 Already in Use

**Solution**:
```bash
# Find what's using the port
sudo lsof -i :8080

# Kill the process
sudo fuser -k 8080/tcp

# Wait and restart
sleep 2
nohup npm run dev > nohup.out 2>&1 &
```

### Issue: Node.js Version Too Old

**Error**: `SyntaxError: Unexpected token '.'`

**Solution**: Upgrade Node.js (see Step 4)

### Issue: Server Stops After Disconnecting

**Make sure you used `nohup`**:
```bash
nohup npm run dev > nohup.out 2>&1 &
```

### Issue: Can't Access from Browser

**Check**:
1. VM firewall allows port 8080
2. Vite config has `host: '0.0.0.0'`
3. Server is actually running: `ps aux | grep npm`

---

## Quick Re-Deployment Script

**Save this as `redeploy.sh` on your local machine:**

```bash
#!/bin/bash

# Local machine - compress and upload
cd /Users/raishira/Downloads/BNI_LOS_FE
tar -czf bni-los-webapp-updated.tar.gz bni-los-webapp/
scp -i pem_ibmcloudvsi_download_3.pem -P 2223 \
    bni-los-webapp-updated.tar.gz itzuser@52.116.129.247:~/

# VM - deploy and restart
ssh -i pem_ibmcloudvsi_download_3.pem -p 2223 itzuser@52.116.129.247 'bash -s' << 'EOF'
pkill -f "npm run dev"
cd ~/BNI_V2/bni-los-frontend
rm -rf bni-los-webapp
tar -xzf ~/bni-los-webapp-updated.tar.gz
cd bni-los-webapp
npm install
nohup npm run dev > nohup.out 2>&1 &
sleep 3
tail -15 nohup.out
EOF

echo "✅ Deployment complete! Access at http://52.116.129.247:8080"
```

**Make it executable:**
```bash
chmod +x redeploy.sh
```

**Run it:**
```bash
./redeploy.sh
```

---

## Summary

Your BNI LOS application is now deployed on:
- **URL**: `http://52.116.129.247:8080`
- **Server**: Vite development server
- **Process**: Running in background with nohup
- **Logs**: `~/BNI_V2/bni-los-frontend/bni-los-webapp/nohup.out`

All enhanced features are live:
✅ New Application form with 12+ fields
✅ Password field in Login
✅ PKS Companies management
✅ Reject functionality for all reviewer roles
✅ Money formatting with period separator
✅ MoneyInput in disbursement modal

---

## Notes

- **Development Server**: Currently running Vite dev server. For production, consider building static files and serving with Nginx.
- **Node.js**: Upgraded to v20.19.6 for compatibility.
- **Port 8080**: Standard alternative HTTP port, commonly used for development.
- **Process Management**: Using `nohup` for simplicity. Consider using PM2 for production.
