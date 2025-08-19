import { Context, Telegraf } from "telegraf";
import { BskyConnection } from "../connectors/bskyConnection.ts";
import { TelegramConnection } from "../connectors/telegramConnection.ts";
import https from "https";
import fs from "fs";
import axios, { AxiosResponse } from "axios";

export const setupCommands = (bot: Telegraf) => {
  // Greeting command
  bot.command("test1", (ctx: Context) => ctx.reply("this uses context reply"));

  // Lambda command
  bot.command("test2", Telegraf.reply("this uses telegraph's reply"));

  // Lambda command
  bot.command("image", (ctx: Context) =>
    ctx.replyWithPhoto("https://shapes.inc/api/public/avatar/emuotori-n6m4", {
      caption: "This is EMU OTORI!!",
    })
  );

  bot.command("image2", (ctx: Context) => {
    ctx.reply("KEEP ROLLING ROLLING ROLLING ROLLING");
    ctx.replyWithPhoto("https://shapes.inc/api/public/avatar/emuotori-n6m4", {
      caption: "This is EMU FUCKING OTORI!!",
    });
  });
/*
  // Handler for photos with /image3 in caption
  bot.on("photo", async (ctx) => {
    try {
      const caption = ctx.message?.caption || "";
      if (caption.includes("/image3")) {
        console.log("Photo message:", JSON.stringify(ctx.message, null, 2));
        const photoArray = ctx.message.photo;
        const fileId = photoArray[photoArray.length - 1].file_id;
        const path = `./img/${fileId}.jpeg`;
        ctx.reply(fileId);
        ctx.telegram.getFileLink(fileId).then((link) => {
          https.get(link, (response) =>
            response.pipe(fs.createWriteStream(path))
          );
        });

        ctx.reply("keep rolling rolling rolling rolling");
        await ctx.replyWithPhoto({
          source: path,
          caption: "This is EMU OTORI!!",
        });
      }
    } catch (error) {
      console.error("Error processing photo with image3 command:", error);
      await ctx.reply("Sorry, there was an error processing your command.");
    }
  });
*/
  // Handler for photos with /image3 in caption
  bot.on("photo", async (ctx) => {
    try {
      const caption = ctx.message?.caption || "";
      if (caption.includes("/postimage")) {
        console.log("Photo message:", JSON.stringify(ctx.message, null, 2));
        const photoArray = ctx.message.photo;
        const fileId = photoArray[photoArray.length - 1].file_id;
        const path = `./img/${fileId}.jpeg`;
        ctx.reply(fileId);
        ctx.telegram.getFileLink(fileId).then((link) => {
          https.get(link, (response) =>
            response.pipe(fs.createWriteStream(path))
          );
        });

        const pdsUrl = "https://bsky.social/xrpc/com.atproto.repo.uploadBlob";
        const imgBytes = fs.readFileSync(path);

        const response: AxiosResponse = await axios.post(pdsUrl, imgBytes, {
          headers: {
            "Content-Type": 'image/jpeg',
            Authorization: `Bearer ${BskyConnection.agent.session.accessJwt}`,
          },
        });

        const blob = response.data.blob;
        const text = caption.split(" ").slice(1).join(" ");
        ctx.reply("Just posted: " + text);
        ctx.replyWithPhoto({
          source: path,
          caption: "This is EMU OTORI!!",
        });

        await BskyConnection.agent.post({
        text: text,
        createdAt: new Date().toISOString(),
        embed: {
          $type: "app.bsky.embed.images",
          images: [
          {
            alt: "",
            image: blob,
          }
          ],
        },
      });
      }
    } catch (error) {
      console.error("Error processing photo with image3 command:", error);
      await ctx.reply("Sorry, there was an error processing your command.");
    }
  });

  // Post to Bluesky
  bot.command("post", async (ctx: Context) => {
    try {
      if (!ctx.message || !("text" in ctx.message)) {
        await ctx.reply("Please provide a text message.");
        return;
      }

      const text = ctx.message.text.split(" ").slice(1).join(" ");

      if (!text) {
        await ctx.reply(
          "Please provide some text for the post. Usage: /post [your text]"
        );
        return;
      }

      await BskyConnection.agent.post({
        text: text,
        createdAt: new Date().toISOString(),
      });

      await ctx.reply(`Just posted: ${text}`);
    } catch (error) {
      console.error("Error posting to Bluesky:", error);
      await ctx.reply(
        "Sorry, there was an error posting to Bluesky. Please try again later."
      );
    }
  });

  // Help command
  bot.command("help", async (ctx: Context) => {
    const helpMessage = `
theres no helping you
    `.trim();
    await ctx.reply(helpMessage);
  });

  return bot;
};
