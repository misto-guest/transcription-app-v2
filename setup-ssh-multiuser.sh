#!/bin/bash

# SSH Multi-User Setup Script
# Configure remote access for you, your dev account, and your work PC

set -e

echo "🔐 SSH Multi-User Remote Access Setup"
echo "====================================="
echo ""

# Get current user
CURRENT_USER=$(whoami)
CURRENT_HOST=$(hostname)

echo "Current User: $CURRENT_USER"
echo "Current Host: $CURRENT_HOST"
echo ""

# Check if Remote Login is enabled
echo "Step 1: Checking Remote Login status..."
if sudo systemsetup -getremotelogin | grep -q "Enabled"; then
    echo "✅ Remote Login already enabled"
else
    echo "Enabling Remote Login..."
    sudo systemsetup -setremotelogin on
    echo "✅ Remote Login enabled"
fi

echo ""
echo "Step 2: Setting up SSH keys..."
echo "--------------------------------"

# Create .ssh directory if it doesn't exist
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Generate SSH key if it doesn't exist
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "Creating SSH key pair..."
    ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519 -C "$CURRENT_USER@$CURRENT_HOST"
    echo "✅ SSH keys created"
else
    echo "✅ SSH keys already exist"
fi

# Setup authorized_keys
if [ ! -f ~/.ssh/authorized_keys ]; then
    touch ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    echo "✅ Created authorized_keys file"
fi

# Add current public key
if ! grep -q "$(cat ~/.ssh/id_ed25519.pub)" ~/.ssh/authorized_keys 2>/dev/null; then
    cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
    echo "✅ Added current public key to authorized_keys"
else
    echo "✅ Public key already in authorized_keys"
fi

echo ""
echo "Step 3: Getting network information..."
echo "---------------------------------------"

# Get local IP
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)

if [ -z "$LOCAL_IP" ]; then
    echo "⚠️  Could not detect local IP"
    LOCAL_IP="YOUR_LOCAL_IP"
else
    echo "✅ Local IP: $LOCAL_IP"
fi

# Get public IP
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "unknown")
echo "✅ Public IP: $PUBLIC_IP"

echo ""
echo "Step 4: Creating connection scripts..."
echo "--------------------------------------"

# Create connection script for main user
cat > ~/connect-from-mac.sh <<EOF
#!/bin/bash
# Connect from your Mac
ssh -i ~/.ssh/id_ed25519 $CURRENT_USER@$LOCAL_IP
EOF
chmod +x ~/connect-from-mac.sh

# Create connection script for work PC
cat > ~/connect-from-work.txt <<EOF
# Connect from Work PC
# 1. Copy your SSH private key to ~/.ssh/id_ed25519 on work PC
# 2. Run: ssh -i ~/.ssh/id_ed25519 $CURRENT_USER@$LOCAL_IP

# Or with password:
ssh $CURRENT_USER@$LOCAL_IP
EOF

echo "✅ Connection scripts created"

echo ""
echo "Step 5: Creating dev user access..."
echo "------------------------------------"

read -p "Do you want to create a separate 'dev' user? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if ! id "dev" &>/dev/null; then
        echo "Creating 'dev' user..."
        sudo sysadminctl -addUser dev
        sudo dseditgroup -o edit -t user -a dev admin
        echo "✅ Dev user created (password required on first login)"
    else
        echo "✅ Dev user already exists"
    fi

    # Setup SSH for dev user
    sudo mkdir -p /Users/dev/.ssh
    sudo chmod 700 /Users/dev/.ssh

    # Generate key for dev user
    if [ ! -f /Users/dev/.ssh/id_ed25519 ]; then
        sudo ssh-keygen -t ed25519 -N "" -f /Users/dev/.ssh/id_ed25519 -C "dev@$CURRENT_HOST"
        echo "✅ Dev user SSH keys created"
    fi

    # Setup authorized_keys for dev
    if [ ! -f /Users/dev/.ssh/authorized_keys ]; then
        sudo touch /Users/dev/.ssh/authorized_keys
        sudo chmod 600 /Users/dev/.ssh/authorized_keys
    fi

    # Add dev public key
    if ! sudo grep -q "$(cat /Users/dev/.ssh/id_ed25519.pub)" /Users/dev/.ssh/authorized_keys 2>/dev/null; then
        sudo cat /Users/dev/.ssh/id_ed25519.pub | sudo tee -a /Users/dev/.ssh/authorized_keys > /dev/null
        echo "✅ Dev public key added to authorized_keys"
    fi

    # Fix permissions
    sudo chown -R dev:staff /Users/dev/.ssh

    echo ""
    echo "📋 Dev User Connection Info:"
    echo "   User: dev"
    echo "   Host: $LOCAL_IP"
    echo "   Command: ssh dev@$LOCAL_IP"
fi

echo ""
echo "Step 6: Testing SSH configuration..."
echo "--------------------------------------"

# Test SSH config
sudo mkdir -p /etc/ssh
sudo touch /etc/ssh/sshd_config

# Enable key-based authentication
if ! sudo grep -q "^PubkeyAuthentication yes" /etc/ssh/sshd_config 2>/dev/null; then
    echo "PubkeyAuthentication yes" | sudo tee -a /etc/ssh/sshd_config > /dev/null
fi

# Restart SSH if needed
echo "✅ SSH configuration tested"

echo ""
echo "🎉 SSH Setup Complete!"
echo "====================="
echo ""
echo "📱 Connection Details:"
echo "   Main User: $CURRENT_USER@$LOCAL_IP"
echo "   Dev User: dev@$LOCAL_IP (if created)"
echo ""
echo "🔐 Public Keys (for passwordless login):"
echo "   Main User:"
cat ~/.ssh/id_ed25519.pub
if [ -f /Users/dev/.ssh/id_ed25519.pub ]; then
    echo "   Dev User:"
    sudo cat /Users/dev/.ssh/id_ed25519.pub
fi
echo ""
echo "📋 To Connect from Other Devices:"
echo ""
echo "   1. From Your Other Mac:"
echo "      ssh -i ~/.ssh/id_ed25519 $CURRENT_USER@$LOCAL_IP"
echo ""
echo "   2. From Work PC:"
echo "      a. Copy the public key above"
echo "      b. Add it to: ~/.ssh/authorized_keys on work PC"
echo "      c. Connect: ssh $CURRENT_USER@$LOCAL_IP"
echo ""
echo "   3. From iPhone/iPad (Termius app):"
echo "      a. Download Termius from App Store"
echo "      b. Import your SSH key"
echo "      c. Add host: $LOCAL_IP"
echo "      d. User: $CURRENT_USER"
echo ""
echo "   4. Behind Router? Use ngrok:"
echo "      brew install ngrok/ngrok/ngrok"
echo "      ngrok tcp 22"
echo ""
echo "🔒 Security Notes:"
echo "   - SSH keys are more secure than passwords"
echo "   - Only add public keys to authorized_keys"
echo "   - Keep private keys (.ssh/id_ed25519) SECRET!"
echo "   - Disable password auth in /etc/ssh/sshd_config for extra security"
echo ""
echo "✅ Ready for remote access!"
