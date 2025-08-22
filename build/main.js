import { BskyConnection } from './connectors/bskyConnection.ts';
import { TelegramConnection } from './connectors/telegramConnection.ts';
import { setupCommands } from './commands/commands.ts';
// Initialize connections
await BskyConnection.login();
await TelegramConnection.connect();
// Setup commands
setupCommands(TelegramConnection.bot);
// Launch bot
await TelegramConnection.bot.launch();
console.log('Bot is running...');
// Graceful shutdown
process.once("SIGINT", () => TelegramConnection.bot.stop("SIGINT"));
process.once("SIGTERM", () => TelegramConnection.bot.stop("SIGTERM"));
