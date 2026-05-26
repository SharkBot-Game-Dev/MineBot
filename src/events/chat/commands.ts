import type { Bot } from "mineflayer";
import { commands } from "../../temp/commands.js";

export function execute(username: string, message: string, bot: Bot) {
    if (username === bot.username) return;

    if (!message.startsWith("!")) return;
    const args = message.slice("!".length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();

    if (!command) return;

    try {
        commands[command]?.execute(username, message, bot);
    } catch (e) {
        console.error(e)
        return;
    }
}