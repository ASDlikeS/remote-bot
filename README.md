# Remote-bot 🤖 - Your Telegram-Powered PC Remote Control

![Remote Control](https://img.shields.io/badge/Remote-Control-blue?style=for-the-badge&logo=telegram)
![Bun](https://img.shields.io/badge/Powered_by-Bun-black?style=for-the-badge&logo=bun)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

![TelegramBot](image.png)

## 🌟 What is Remote-bot?

Remote-bot transforms your Telegram chat into a command center for your PC! Control your computer from anywhere in the world with simple text commands. Whether you're on vacation or just too comfortable on your couch, remote-bot has you covered.

## This telegram bot:

👉 [@asd_remote_bot](https://t.me/asd_remote_bot)

![DevelopinStage](https://media0.giphy.com/media/Mah9dFWo1WZX0WM62Q/giphy.gif?cid=6c09b952l7elw4ti8b8zajeer35s0vetfc94a49eik81b6d4&ep=v1_gifs_search&rid=giphy.gif&ct=g)

## ✨ Features That Make remote-bot Awesome

-   🔐 **Secure Authentication** - Only registered users with valid Telegram IDs can access your system
-   🚀 **Full Remote Control** - Execute system commands, monitor processes, check resources
-   💎 **Premium Subscription System** - With real-time countdown timers for premium access
-   ⚙️ **Smart Permission Management** - Automatic access adjustment when subscriptions expire
-   📊 **Lightweight SQLite Database** - Efficient storage using `bun:sqlite`
-   🔄 **Live Updates** - Dynamic message editing for subscription status - no spam!
-   🧩 **Modular Design** - Easily extend with your own commands and features

## 🚀 Get Started in 3... 2... 1...

### Prerequisites

-   📦 [Bun](https://bun.sh/) installed (the speedy Node.js alternative)
-   🤖 Telegram bot token (get it from [@BotFather](https://t.me/botfather))
-   🐙 Git installed

### Installation

```bash
# Clone this magnificent repository
git clone https://github.com/ASDlikeS/remote-bot

# Enter the magic folder
cd remote-bot

# Install dependencies at warp speed
bun install
```

### Configuration 🛠️

Create a `.env` file with your secret ingredients:

```
TELEGRAM_BOT_TOKEN=your_bot_token_here
+
ADMIN_ID=your_id_from_telegram
```

### Launch Your Bot to the Stars 🚀

```bash
bun start
```

## 📱 How to Use Remote-bot

1. **Start a Chat**: Open Telegram and find your bot
2. **Say Hello**: Send `/start` to register and see your status
3. **Take Control**: Use commands like:
    - `/premium` - Check system status
    - `/info_about_premium` - Run a system command
    - `/help` - List running processes
    - `/test` - Command for testing
    ***
4. **ADMIN ONLY**: Commands only available to admins
    - `/add_time_usr` - Additional time to a user's subscription
    - `/promote_usr` - Give user premium rights
    - `/demote_usr` - Revoke user premium rights
    - `/ban_usr` - Remove user from group
5. **Enjoy Your Remote Control Experience**

Watch as your subscription timer updates in real-time! ⏱️

## 💻 Command Examples

```
    /close - Close current window
    /restart - Restart your PC
    /shutdown - Shutdown your PC
    /screenshot - Take a screenshot of your desktop
    /note - Open note file
    /volume {changing volume in proccent %}
    /kill_process {process name}
    /set_date {date}

```

## 🤝 Contribute to the Magic

Remote-bot loves new friends and contributors!

-   🐛 **Found a Bug?** Open an issue with all the juicy details
-   💡 **Have an Idea?** Share it through a feature request issue
-   👨‍💻 **Code Wizard?** Fork, code, and send a pull request

## 📝 License

RemoteBot is MIT licensed - free as in freedom! 🦅

## 🙏 Acknowledgements

-   Telegram Bot API for making this magic possible
-   Bun.js for the speed demons among us
-   You, for being awesome enough to use RemoteBot

---

![Made with Love](https://img.shields.io/badge/Made_with-Code_&_Love-red?style=for-the-badge&logo=heart)

**Created by [@ASDlikeS](https://github.com/ASDlikeS)** | [Report Bug](https://github.com/ASDlikeS/remote-bot/issues) | [Request Feature](https://github.com/ASDlikeS/remote-bot/issues)
