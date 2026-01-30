#!/bin/bash

# Quick SSH Connection Helper
# Shows all connection details for your Mac mini

echo "🔐 SSH Connection Details"
echo "======================="
echo ""

CURRENT_USER=$(whoami)
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "unknown")

echo "📍 Network Info:"
echo "   Local IP: $LOCAL_IP"
echo "   Public IP: $PUBLIC_IP"
echo ""

echo "👤 Users:"
echo "   Main user: $CURRENT_USER"
if id "dev" &>/dev/null; then
    echo "   Dev user: dev (exists)"
else
    echo "   Dev user: dev (not created)"
fi
echo ""

echo "🔑 SSH Public Keys:"
if [ -f ~/.ssh/id_ed25519.pub ]; then
    echo "   Main user ($CURRENT_USER):"
    cat ~/.ssh/id_ed25519.pub
else
    echo "   No SSH key found. Generate with: ssh-keygen -t ed25519"
fi
echo ""

if [ -f /Users/dev/.ssh/id_ed25519.pub ]; then
    echo "   Dev user:"
    sudo cat /Users/dev/.ssh/id_ed25519.pub
fi
echo ""

echo "📱 Quick Connect Commands:"
echo ""
echo "   From this Mac:"
echo "   ssh $CURRENT_USER@$LOCAL_IP"
echo ""
echo "   From another Mac:"
echo "   ssh -i ~/.ssh/id_ed25519 $CURRENT_USER@$LOCAL_IP"
echo ""
echo "   From Windows (PowerShell):"
echo "   ssh -i C:\\Users\\YourName\\.ssh\\id_ed25519 $CURRENT_USER@$LOCAL_IP"
echo ""

echo "📲 iOS (iPhone/iPad):"
echo "   1. Download Termius app"
echo "   2. Import SSH key"
echo "   3. Add host: $LOCAL_IP"
echo "   4. User: $CURRENT_USER"
echo ""

echo "🌐 External Access (if configured):"
echo "   Via public IP: ssh $CURRENT_USER@$PUBLIC_IP"
echo "   Via ngrok: ssh $CURRENT_USER@0.tcp.ngrok.io -p PORT"
echo ""

echo "🔧 Remote Login Status:"
if sudo systemsetup -getremotelogin 2>/dev/null | grep -q "Enabled"; then
    echo "   ✅ Enabled"
else
    echo "   ❌ Disabled (enable in System Settings → Sharing)"
fi
echo ""

echo "💡 Pro Tips:"
echo "   - Add 'Host mini' to ~/.ssh/config for easy access"
echo "   - Use ngrok for external access without router config"
echo "   - Keep private keys safe - never share them!"
echo ""

# Optional: Create ~/.ssh/config entry for easy access
if ! grep -q "Host mini" ~/.ssh/config 2>/dev/null; then
    echo "Would you like me to create a shortcut in ~/.ssh/config? (y/n): "
    read -r answer
    if [[ "$answer" =~ ^[Yy]$ ]]; then
        mkdir -p ~/.ssh
        cat >> ~/.ssh/config <<EOF

# Mac mini shortcut
Host mini
    HostName $LOCAL_IP
    User $CURRENT_USER
    IdentityFile ~/.ssh/id_ed25519
EOF
        echo "✅ Shortcut created!"
        echo "   Now you can just run: ssh mini"
    fi
fi
