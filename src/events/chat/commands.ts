import type { Bot } from "mineflayer";
import { commands } from "../../temp/commands.js";

export function execute(username: string, message: string, translate: any, jsonMsg: any, bot: Bot) {
    if (username === bot.username) return;

    if (!message.startsWith("!")) return;
    
    const args = message.slice("!".length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName || !(commandName in commands)) return;

    try {
        const command = commands[commandName];
        if (!command) return;

        console.log(`${commandName}が${username}によって実行されました。`)

        command.execute(username, args, bot);

    } catch (e) {
        console.error(e);
        return;
    }
}