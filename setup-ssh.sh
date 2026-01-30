#!/bin/bash

# SSH Remote Access Setup for Mac mini
# Simple, free, no installation required

echo "🔧 SSH Remote Access Setup"
echo "==========================="
echo ""

echo "Step 1: Enable Remote Login"
echo "---------------------------"
echo "Open: System Settings → General → Sharing"
echo "Toggle: 'Remote Login' ON"
echo ""
read -p "Press Enter after you've enabled Remote Login..."

echo ""
echo "Step 2: Get Your Mac's IP Address"
echo "-----------------------------------"
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)
echo "✅ Your IP: $IP"
echo ""

echo "Step 3: Create SSH Keys (Passwordless Login)"
echo "---------------------------------------------"
if [ ! -f ~/.ssh/id_ed25519 ]; then
  echo "Creating SSH keys..."
  ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519 -C "$(whoami)@$(hostname)"
else
  echo "✅ SSH keys already exist"
fi

echo ""
echo "Step 4: Copy Public Key to Mac"
echo "-------------------------------"
cat ~/.ssh/id_ed25519.pub
echo ""
echo "Copy the public key above and add it to:"
echo "  ~/.ssh/authorized_keys"
echo ""
read -p "Press Enter after adding the key..."

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🔗 Connection Details:"
echo "   Host: $IP"
echo "   User: $(whoami)"
echo "   Port: 22"
echo ""
echo "📱 To connect from another device:"
echo "   ssh $(whoami)@$IP"
echo ""
echo "🔒 For passwordless login:"
echo "   ssh -i ~/.ssh/id_ed25519.pub $(whoami)@$IP"
