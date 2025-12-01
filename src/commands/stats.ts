import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const WORLD_STATS = "/root/minecraft-server/world/stats";
const USERNAMECACHE = "/root/minecraft-server/usernamecache.json";

const loadUsernameCache = () => {
  const raw = readFileSync(USERNAMECACHE, "utf8");
  const json = JSON.parse(raw);

  const map = new Map<string, string>();

  for (const uuid of Object.keys(json)) {
    map.set(uuid, json[uuid]);
  }
  return map;
};

const getAllPlayerStats = () => {
  const usernameCache = loadUsernameCache();
  const files = readdirSync(WORLD_STATS).filter((f) => f.endsWith(".json"));

  const players = files.map((file) => {
    const uuid = file.replace(".json", "");
    const raw = readFileSync(join(WORLD_STATS, file), "utf8");
    const json = JSON.parse(raw);

    const stats = json.stats ?? json; 


    const custom = stats["minecraft:custom"] ?? {};
    const killed = stats["minecraft:killed"] ?? {};
    const playtimeTicks =
      custom["minecraft:total_world_time"] ??
      custom["minecraft:play_time"] ??
      0;

    const deaths = custom["minecraft:deaths"] ?? 0;
    const pvpKills = killed["minecraft:player"] ?? 0;

    const hours = playtimeTicks > 0 ? playtimeTicks / 20 / 3600 : 0;

    return {
      hours,
      uuid,
      name: usernameCache.get(uuid) ?? `OfflinePlayer-${uuid.substring(0, 8)}`,
      deaths,
      pvpKills,
    };
  });
  return players;
};

const formatTable = (players: any[]) => {
  let table = "```\n# | Jugador        | Horas | Kills | Muertes\n";
  table += "--+----------------+-------+-------+--------\n";

  players.forEach((p, i) => {
    table += `${String(i + 1).padEnd(2)}| ${p.name.padEnd(15)}| ${p.hours
      .toFixed(1)
      .padEnd(6)}| ${String(p.pvpKills).padEnd(6)}| ${p.deaths}\n`;
  });

  table += "```";
  return table;
};

const handleInteraction = async (interaction: ChatInputCommandInteraction) => {
  try {
    const players = getAllPlayerStats()
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 10);

    await interaction.reply(formatTable(players));
  } catch (error) {
    console.log(error);
    await interaction.reply("Error al obtener la información del servidor");
  }
};

export default {
  data: new SlashCommandBuilder()
    .setName("minestats")
    .setDescription("Muestra las estadísticas de los jugadores"),
  async execute(interaction: ChatInputCommandInteraction) {
    await handleInteraction(interaction);
  },
};
