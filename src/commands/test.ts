import type { Bot } from "mineflayer";

export const name = "test";

export async function execute(username: string, args: string, bot: Bot) {
    bot.chat("Test!")
}