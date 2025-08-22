import { Telegraf } from "telegraf";
import dotenv from "dotenv";
dotenv.config();
export class TelegramConnection {
    static bot;
    static async connect() {
        this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");
    }
}
