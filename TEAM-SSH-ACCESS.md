# 👥 Team SSH Access - Complete Guide

## Quick Summary

**Two Options:**
1. **Single User (Simpler)** - Everyone shares one account
2. **Separate Users (Better)** - Each person has their own account

---

## Option A: Single User with Multiple Keys (Recommended for Small Teams)

### When to Use
- Teams of 2-5 people
- Everyone needs same access level
- Easier to manage

### Setup Steps

#### 1. Each Team Member Generates Key

**They run on their computer:**
```bash
ssh-keygen -t ed25519 -C "john@company" -f ~/.ssh/work_mac
```

#### 2. They Send You Public Key

**They run:**
```bash
cat ~/.ssh/work_mac.pub
```

Output example:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMyjnk... john@company
```

#### 3. You Add Key to authorized_keys

**On your Mac:**
```bash
cd ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMyjnk... john@company" >> authorized_keys
```

Repeat for each team member.

#### 4. They Connect

**Each team member:**
```bash
ssh -i ~/.ssh/work_mac northsea@YOUR_MAC_IP
```

---

## Option B: Separate User Accounts (Better Security)

### When to Use
- Teams of 5+ people
- Different access levels needed
- Better security & audit trail

### Setup Steps

#### 1. Create User Account

```bash
# Create user
sudo sysadminctl -addUser alice

# Add to admin group (if they need admin)
sudo dseditgroup -o edit -t user -a alice admin

# Set password
sudo passwd alice
```

#### 2. Setup SSH for New User

```bash
# Create .ssh directory
sudo mkdir -p /Users/alice/.ssh
sudo chmod 700 /Users/alice/.ssh

# Generate SSH key for user
sudo ssh-keygen -t ed25519 -N "" -f /Users/alice/.ssh/id_ed25519

# Setup authorized_keys
sudo touch /Users/alice/.ssh/authorized_keys
sudo chmod 600 /Users/alice/.ssh/authorized_keys

# Add their public key
echo "alice-public-key-here" | sudo tee -a /Users/alice/.ssh/authorized_keys

# Fix ownership
sudo chown -R alice:staff /Users/alice/.ssh
```

#### 3. Alice Connects

```bash
ssh alice@YOUR_MAC_IP
```

---

## 🔧 Automated Team Management

I've created a script that helps:

```bash
~/clawd-dmitry/transcription-app/team-ssh-manager.sh
```

**Features:**
- ✅ Add team member's SSH key
- ✅ List all authorized keys
- ✅ Remove team member's key
- ✅ Create new user accounts
- ✅ View connection details

**Usage:**
```bash
~/clawd-dmitry/transcription-app/team-ssh-manager.sh
```

Follow the menu prompts to manage team access.

---

## 📋 Team Access Matrix

| User Type | Account Type | SSH Key | Access Level |
|-----------|-------------|---------|--------------|
| You | northsea (main) | Your key | Full admin |
| Team Lead | Separate user | Their key | Admin |
| Developer | Separate user | Their key | Standard |
| Contractor | northsea (shared) | Their key | Limited |

---

## 🔒 Security Best Practices

### For Small Teams (Single User)
- ✅ Each person has unique SSH key
- ✅ You can revoke access by removing their key
- ✅ Monitor who logged in: `last | grep sshd`
- ❌ Everyone shares same password (if password auth enabled)

### For Large Teams (Separate Users)
- ✅ Each person has own account
- ✅ Different access levels per user
- ✅ Full audit trail: `who` shows who's logged in
- ✅ Can suspend accounts without affecting others

### Always
- ✅ Use **SSH keys only** (disable password auth)
- ✅ Use **ed25519** keys (not RSA)
- ✅ Rotate keys periodically
- ✅ Remove access for ex-team members immediately

---

## 🚨 Revoking Access

### Remove SSH Key (Single User Mode)

```bash
# List keys
nl -ba ~/.ssh/authorized_keys

# Remove by line number
sed -i '' '5d' ~/.ssh/authorized_keys

# Or edit manually
nano ~/.ssh/authorized_keys
```

### Remove User Account (Separate User Mode)

```bash
# Disable account
sudo sysadminctl -deleteUser username

# Or just disable SSH
sudo chmod 000 /Users/username/.ssh
```

---

## 📊 Monitoring Team Access

### See Who's Currently Logged In

```bash
who
# Shows: username, tty, login time, from where
```

### View SSH Login History

```bash
last | grep sshd
# Shows: login times, which users, from where
```

### List All User Accounts

```bash
dscl . list /Users | grep -v '^_'
```

---

## 🎯 Quick Reference

### Add Team Member (Single User)
1. They generate key: `ssh-keygen -t ed25519`
2. They send you public key
3. You add it: `echo "KEY" >> ~/.ssh/authorized_keys`
4. They connect: `ssh -i ~/.ssh/key northsea@IP`

### Add Team Member (Separate User)
1. Create user: `sudo sysadminctl -addUser alice`
2. Setup their SSH: `sudo mkdir -p /Users/alice/.ssh`
3. Generate their key: `sudo ssh-keygen -t ed25519 -f /Users/alice/.ssh/id_ed25519`
4. They connect: `ssh alice@IP`

### Remove Team Member
- **Single user:** Remove their public key from authorized_keys
- **Separate user:** Disable their account: `sudo sysadminctl -deleteUser username`

---

## 💡 Recommendation

**Start with:** Option A (single user, multiple keys)

**Upgrade to:** Option B (separate users) when team grows beyond 5 people

**Why:** Easier to manage initially, better security later when needed.

---

## 🚀 Get Started

**Run the team manager:**
```bash
~/clawd-dmitry/transcription-app/team-ssh-manager.sh
```

**Or follow manual steps above!**

Your team can access your Mac securely in 5 minutes! 🎯
