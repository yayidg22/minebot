import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const WORLD_STATS = "/root/minecraft-server/world/stats";
const USERCACHE = "/root/minecraft-server/world/usercache.json";

const loadUserCache = () => {
  const raw = readFileSync(USERCACHE, "utf8");
  const list = JSON.parse(raw);

  const map = new Map<string, string>();
  for (const entry of list) {
    map.set(entry.uuid, entry.name);
  }
  return map;
};

const getAllPlayerStats = () => {
  const userCache = loadUserCache();
  const files = readdirSync(WORLD_STATS).filter((f) => f.endsWith(".json"));

  const players = files.map((file) => {
    const uuid = file.replace(".json", "");
    const raw = readFileSync(join(WORLD_STATS, file), "utf8");
    const json = JSON.parse(raw);

    const custom = json["minecraft:custom"] ?? {};
    const killed = json["minecraft:killed"] ?? {};

    const playtimeTicks = custom["minecraft:play_time"] ?? 0;
    const deaths = custom["minecraft:death_count"] ?? 0;
    const pvpKills = killed["minecraft:player"] ?? 0;

    return {
      uuid,
      name: userCache.get(uuid) ?? uuid.substring(0, 8),
      hours: playtimeTicks / 20 / 3600,
      deaths,
      pvpKills,
    };
  });

  return players;
};

const handleInteraction = async (interaction: ChatInputCommandInteraction) => {
  try {
    const players = getAllPlayerStats()
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 10);

    let table = "```\n# | Jugador        | Horas | Kills | Muertes\n";
    table += "--+--------------+-------+-------+--------\n";

    players.forEach((p, i) => {
      table += `${String(i + 1).padEnd(2)}| ${p.name.padEnd(13)}| ${p.hours
        .toFixed(1)
        .padEnd(6)}| ${String(p.pvpKills).padEnd(6)}| ${p.deaths}\n`;
    });

    table += "```";

    await interaction.reply(table);
  } catch (error) {
    console.log(error);
    await interaction.reply("Error al obtener la informacion del servidor");
  }
};

export default {
  data: new SlashCommandBuilder()
    .setName("minestats")
    .setDescription("Muestra las estadisticas de los jugadores"),
  async execute(interaction: ChatInputCommandInteraction) {
    await handleInteraction(interaction);
  },
};
