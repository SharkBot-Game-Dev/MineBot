import type { Bot } from "mineflayer";

export const name = "eval";

export async function execute(username: string, args: string[], bot: Bot) {
    if (username != process.env.OWNER_USERNAME) return;
    if (args.length < 1) {
        bot.chat("使い方: !eval <jscode>")
        return
    }
    try {
        const res = new String(eval(args.join(" ")));
        bot.chat(res.toString());
    } catch (e) {
        console.error(e)
        bot.chat("エラーが発生しました。");
        return;
    }
}