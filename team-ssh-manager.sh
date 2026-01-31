#!/bin/bash

# Team SSH Access Manager
# Add or remove team member SSH access

set -e

echo "👥 Team SSH Access Manager"
echo "=========================="
echo ""

CURRENT_USER=$(whoami)
AUTH_KEYS="$HOME/.ssh/authorized_keys"

echo "Current user: $CURRENT_USER"
echo "SSH keys file: $AUTH_KEYS"
echo ""

# Ensure .ssh exists and has correct permissions
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch "$AUTH_KEYS"
chmod 600 "$AUTH_KEYS"

# Main menu
while true; do
    echo ""
    echo "What would you like to do?"
    echo "  1) Add a team member's SSH key"
    echo "  2) List all authorized keys"
    echo "  3) Remove a team member's key"
    echo "  4) Create a new user account"
    echo "  5) View connection details"
    echo "  6) Exit"
    echo ""
    read -p "Choose option (1-6): " choice

    case $choice in
        1)
            echo ""
            echo "📝 Adding Team Member's SSH Key"
            echo "-------------------------------"
            echo ""
            echo "Ask your team member to run this and send you the output:"
            echo "  ssh-keygen -t ed25519 -C 'name@company' -f ~/.ssh/work_mac"
            echo "  cat ~/.ssh/work_mac.pub"
            echo ""
            read -p "Paste their public key here: " new_key

            if [ -n "$new_key" ]; then
                echo "$new_key" >> "$AUTH_KEYS"
                echo "✅ Key added successfully!"
                echo ""
                echo "Team member can now connect with:"
                echo "  ssh -i ~/.ssh/work_mac $CURRENT_USER@$(ipconfig getifaddr en0)"
            else
                echo "❌ No key provided"
            fi
            ;;

        2)
            echo ""
            echo "📋 All Authorized SSH Keys"
            echo "----------------------------"
            echo ""
            if [ -f "$AUTH_KEYS" ]; then
                echo "Current keys in $AUTH_KEYS:"
                echo ""
                nl -ba -w 2 "$AUTH_KEYS"
                echo ""
                echo "Total: $(wc -l < "$AUTH_KEYS") keys"
            else
                echo "No authorized keys file found"
            fi
            ;;

        3)
            echo ""
            echo "🗑️  Remove Team Member's Key"
            echo "----------------------------"
            echo ""
            if [ -f "$AUTH_KEYS" ]; then
                echo "Current keys:"
                nl -ba -w 2 "$AUTH_KEYS"
                echo ""
                read -p "Enter line number to remove: " line_num

                if [[ "$line_num" =~ ^[0-9]+$ ]]; then
                    # Backup first
                    cp "$AUTH_KEYS" "$AUTH_KEYS.backup"

                    # Remove the line
                    sed -i '' "${line_num}d" "$AUTH_KEYS"

                    echo "✅ Key removed (backup saved to authorized_keys.backup)"
                else
                    echo "❌ Invalid line number"
                fi
            else
                echo "❌ No keys file found"
            fi
            ;;

        4)
            echo ""
            echo "👤 Create New User Account"
            echo "-------------------------"
            echo ""
            read -p "New username: " new_user

            if [ -z "$new_user" ]; then
                echo "❌ Username cannot be empty"
                continue
            fi

            if id "$new_user" &>/dev/null; then
                echo "❌ User '$new_user' already exists"
                continue
            fi

            echo "Creating user: $new_user"
            sudo sysadminctl -addUser "$new_user"

            # Setup SSH for new user
            sudo mkdir -p "/Users/$new_user/.ssh"
            sudo ssh-keygen -t ed25519 -N "" -f "/Users/$new_user/.ssh/id_ed25519"

            # Setup authorized_keys
            sudo touch "/Users/$new_user/.ssh/authorized_keys"
            sudo chmod 600 "/Users/$new_user/.ssh/authorized_keys"
            sudo chmod 700 "/Users/$new_user/.ssh"

            # Add their own key
            sudo cat "/Users/$new_user/.ssh/id_ed25519.pub" | sudo tee -a "/Users/$new_user/.ssh/authorized_keys" > /dev/null

            # Fix ownership
            sudo chown -R "$new_user:staff" "/Users/$new_user/.ssh"

            echo "✅ User '$new_user' created!"
            echo ""
            echo "User connection details:"
            echo "  Username: $new_user"
            echo "  SSH: ssh $new_user@$(ipconfig getifaddr en0)"
            echo ""
            echo "Public key to share with $new_user:"
            sudo cat "/Users/$new_user/.ssh/id_ed25519.pub"
            ;;

        5)
            echo ""
            echo "📱 Connection Details"
            echo "---------------------"
            echo ""
            ~/clawd-dmitry/transcription-app/ssh-connection-helper.sh
            ;;

        6)
            echo ""
            echo "👋 Goodbye!"
            exit 0
            ;;

        *)
            echo "❌ Invalid option"
            ;;
    esac
done
