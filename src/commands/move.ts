import type { Bot } from "mineflayer";
import pathfinder_pkg from 'mineflayer-pathfinder';
const { goals } = pathfinder_pkg;

export const name = "move";

export async function execute(username: string, args: string[], bot: Bot) {
    if (username != process.env.OWNER_USERNAME) return;
    if (args.length < 3) {
        bot.chat(`使い方: !move <x> <y> <z>`);
        return;
    }

    const [x, y, z] = args.map(Number) as any;
    if (([x, y, z] as any).some(isNaN)) {
        bot.chat("座標は数値で指定してください");
        return;
    }

    bot.chat(`(${x}, ${y}, ${z})に移動を開始します..`);
    bot.pathfinder.setGoal(new goals.GoalBlock(x, y, z));
}