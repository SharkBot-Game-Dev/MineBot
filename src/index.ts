import mineflayer from "mineflayer";
import { config } from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { commands } from "./temp/commands.js";

config();

const bot = mineflayer.createBot({
  host: process.env.HOST || 'localhost',
  username: process.env.USERNAME || 'Bot',
  auth: 'offline',
  port: process.env.PORT ? Number.parseInt(process.env.PORT) : 25565
});

async function loadEvents() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const eventsPath = path.join(__dirname, 'events');
  
  if (!fs.existsSync(eventsPath)) {
    console.error(`イベントディレクトリが見つかりません: ${eventsPath}`);
    return;
  }

  const eventFolders = fs.readdirSync(eventsPath);

  for (const folder of eventFolders) {
    const folderPath = path.join(eventsPath, folder);
    if (!fs.lstatSync(folderPath).isDirectory()) continue;

    const eventFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.js') || f.endsWith('.ts'));
    const eventName = folder;

    for (const file of eventFiles) {
      const filePath = path.join(folderPath, file);
      
      const imported = await import(pathToFileURL(filePath).href);
      
      const event = imported.default ? imported.default : imported;

      if (typeof event !== 'function' && typeof event.execute !== 'function') {
        console.warn(`${file} は有効なイベント関数をエクスポートしていません`);
        continue;
      }

      const handler = typeof event === 'function' ? event : event.execute;
      const once = event.once ?? false;

      if (once) {
        bot.once(eventName as any, (...args: any[]) => handler(...args, bot));
      } else {
        bot.on(eventName as any, (...args: any[]) => handler(...args, bot));
      }

      console.log(`イベント '${eventName}' を読み込みました (${file})`);
    }
  }
}

async function loadCommands() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const foldersPath = path.join(__dirname, "commands");
    const entries = fs.readdirSync(foldersPath, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isFile() && (entry.name.endsWith(".js"))) {
            const filePath = path.join(foldersPath, entry.name);
            const command = await import(pathToFileURL(filePath).href);

            if ("name" in command && "execute" in command) {
                commands[command.name] = command;
                console.log(`コマンド「${command.name}」を読み込みました。`);
            } else {
                console.warn(`${filePath} は "name" または "execute" が不足しています。`);
            }
        }
    }
}

loadEvents().catch(console.error);
loadCommands().catch(console.error);

bot.on('kicked', console.log);
bot.on('error', console.log);