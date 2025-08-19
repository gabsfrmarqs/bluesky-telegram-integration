import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { BskyConnection } from "./bskyConnection.ts";
import dotenv from "dotenv";

dotenv.config();

export class TelegramConnection {
  public static bot: any;

  static async connect() {
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");
  }
}
