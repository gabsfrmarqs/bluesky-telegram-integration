import dotenv from "dotenv";
import { BskyAgent } from "@atproto/api";
dotenv.config();
export class BskyConnection {
    static agent;
    static async login() {
        this.agent = new BskyAgent({
            service: "https://bsky.social",
        });
        await BskyConnection.agent.login({
            identifier: process.env.BSKY_USERNAME || "",
            password: process.env.BSKY_PASSWORD || "",
        });
        console.log(this.agent.session);
    }
}
