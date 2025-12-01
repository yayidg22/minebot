# MineBot - Minecraft Server Status Discord Bot

A Discord bot that allows you to check the status of your Minecraft server directly from your Discord server.

## Features

- Check Minecraft server status
- Display online players
- Show server version
- Real-time server status updates

## Prerequisites

- Bun 1.3.3 (https://bun.sh/)
- A Discord application and bot token
- Access to a Minecraft server

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/minebot.git
   cd minebot
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required values:
     ```env
     DISCORD_APP_ID=your_discord_app_id
     DISCORD_APP_TOKEN=your_discord_bot_token
     MINECRAFT_SERVER_IP=your_minecraft_server_ip
     MINECRAFT_SERVER_PORT=25565  # Default Minecraft port
     MINECRAFT_VERSION=MINECRAFT VANILLA 1.20.1 # Your server version or Modpack name
     ```

## Usage

1. Start the bot:
   ```bash
   bun start
   ```

2. Invite the bot to your Discord server using the OAuth2 URL generated from the Discord Developer Portal.

3. Use the bot commands in your Discord server to check your Minecraft server status.

## Available Commands

- `/server` - Show Minecraft server information
- `/players` - List currently online players

## Development

- Run in development mode with hot reload:
  ```bash
  bun start
  ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
