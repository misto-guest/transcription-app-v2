# 🔐 SSH Multi-User Setup Guide

## Step 1: Enable Remote Login on Your Mac Mini

**Manual (easiest):**
```
System Settings → General → Sharing → Enable "Remote Login"
```

**Or via Terminal:**
```bash
sudo systemsetup -setremotelogin on
```

**Verify it's enabled:**
```bash
sudo systemsetup -getremotelogin
# Should show: "Remote Login: On"
```

---

## Step 2: Get Your Mac's IP Address

```bash
ipconfig getifaddr en0
# Example output: 192.168.1.100
```

**Write this down** - you'll need it to connect!

---

## Step 3: Set Up SSH Keys (Passwordless Login)

### For Your Main User (northsea)

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519

# Add to authorized_keys
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys

# Set correct permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### For Dev User (Optional)

```bash
# Create dev user
sudo sysadminctl -addUser dev

# Generate dev SSH keys
sudo mkdir -p /Users/dev/.ssh
sudo ssh-keygen -t ed25519 -N "" -f /Users/dev/.ssh/id_ed25519

# Setup authorized_keys for dev
sudo touch /Users/dev/.ssh/authorized_keys
sudo chmod 600 /Users/dev/.ssh/authorized_keys
sudo chmod 700 /Users/dev/.ssh

# Add dev's own key
sudo cat /Users/dev/.ssh/id_ed25519.pub | sudo tee -a /Users/dev/.ssh/authorized_keys > /dev/null

# Fix ownership
sudo chown -R dev:staff /Users/dev/.ssh
```

---

## Step 4: Copy Public Keys to Other Devices

### Your Main User's Public Key:
```bash
cat ~/.ssh/id_ed25519.pub
```

**Copy this entire line** - you'll add it to other devices!

### Dev User's Public Key (if created):
```bash
sudo cat /Users/dev/.ssh/id_ed25519.pub
```

---

## Step 5: Connect from Different Devices

### From Your Other Mac

```bash
# SSH with key
ssh -i ~/.ssh/id_ed25519 northsea@192.168.1.100

# Or if key is already in ~/.ssh/
ssh northsea@192.168.1.100
```

### From Your Work PC (Windows/Linux)

**Windows (PowerShell):**
```powershell
# 1. Copy your private key from Mac to Windows
#    File: ~/.ssh/id_ed25519 → C:\Users\YourName\.ssh\id_ed25519

# 2. Connect in PowerShell
ssh -i C:\Users\YourName\.ssh\id_ed25519 northsea@192.168.1.100
```

**Linux:**
```bash
# Copy private key to ~/.ssh/id_ed25519
ssh -i ~/.ssh/id_ed25519 northsea@192.168.1.100
```

### From iPhone/iPad (Termius App)

1. Download **Termius** from App Store (free)
2. **Import key:**
   - Settings → Keychain → Import Key
   - Paste your private key
   - Save
3. **Add Host:**
   - Host: 192.168.1.100
   - Username: northsea
   - Key: Select your imported key
   - Save
4. **Connect** - just tap the host!

---

## Step 6: Access Behind Router (Optional)

If your Mac is behind a home router, external access needs:

### Option A: Port Forwarding

On your router:
1. Forward external port **22** → internal **192.168.1.100:22**
2. Connect using your **public IP**:
   ```bash
   ssh northsea@YOUR_PUBLIC_IP
   ```

### Option B: ngrok (No Router Config)

```bash
# Install ngrok
brew install ngrok/ngrok/ngrok

# Expose SSH
ngrok tcp 22

# You'll get a URL like: 0.tcp.ngrok.io:12345
# Connect from anywhere:
ssh northsea@0.tcp.ngrok.io -p 12345
```

---

## Step 7: Allow Multiple Users

### Add Your Work PC's Key

**On your work PC, generate key:**
```bash
ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_work
```

**Copy the public key from work PC:**
```bash
cat ~/.ssh/id_work.pub
```

**On your Mac, add it to authorized_keys:**
```bash
# Paste your work PC's public key here
echo "YOUR_WORK_PC_PUBLIC_KEY" >> ~/.ssh/authorized_keys
```

Now your work PC can connect without passwords!

---

## 🔒 Security Best Practices

### Disable Password Authentication (Optional, More Secure)

```bash
sudo nano /etc/ssh/sshd_config
```

Set:
```
PasswordAuthentication no
PubkeyAuthentication yes
```

Restart SSH:
```bash
sudo launchctl unload /System/Library/LaunchDaemons/ssh.plist
sudo launchctl load /System/Library/LaunchDaemons/ssh.plist
```

### Use Strong SSH Keys
- ✅ **ed25519** (what we used) - modern, secure
- ❌ **rsa** - older, weaker

### Monitor SSH Access
```bash
# See who's logged in
who

# View SSH logs
log show --predicate 'process == "sshd"' --last 1h
```

---

## 📊 Connection Summary

| Device | User | Command |
|--------|------|---------|
| Your Mac | northsea | `ssh northsea@192.168.1.100` |
| Dev account | dev | `ssh dev@192.168.1.100` |
| Work PC | northsea | `ssh -i ~/.ssh/id_work northsea@192.168.1.100` |
| iPhone/iPad | northsea | Use Termius app |
| External (ngrok) | northsea | `ssh northsea@0.tcp.ngrok.io -p 12345` |

---

## ✅ Testing Connection

After setup, test from each device:

```bash
# From local network
ssh northsea@192.168.1.100

# From work PC (if external access configured)
ssh northsea@YOUR_PUBLIC_IP

# Via ngrok (if running)
ssh northsea@0.tcp.ngrok.io -p 12345
```

You should get a terminal prompt on your Mac mini!

---

## 🚨 Troubleshooting

### "Connection refused"
- Remote Login not enabled
- SSH not running
- Wrong IP address

### "Permission denied (publickey)"
- Key not in authorized_keys
- Wrong private key
- Permissions on ~/.ssh too open

### "Host unreachable"
- Mac asleep (disable sleep in Energy Saver)
- Wrong network
- Firewall blocking

### Fix Permissions
```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/id_ed25519
```

---

**Ready to test?** Run this from your other device:
```bash
ssh northsea@YOUR_IP
```

Need help? Let me know what device you're connecting from! 🎯
