import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

// Rutas reales
const WORLD_STATS = "/root/minecraft-server/world/stats";
const USERNAMECACHE = "/root/minecraft-server/usernamecache.json";

// Cargar nombres desde usernamecache.json
const loadUsernameCache = () => {
  const raw = readFileSync(USERNAMECACHE, "utf8");
  const json = JSON.parse(raw);

  const map = new Map<string, string>();

  // json es un objeto { uuid: name }
  for (const uuid of Object.keys(json)) {
    map.set(uuid, json[uuid]);
  }
  return map;
};

// Leer estadísticas de cada jugador
const getAllPlayerStats = () => {
  const usernameCache = loadUsernameCache();
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
      name: usernameCache.get(uuid) ?? uuid.substring(0, 8),
      hours: playtimeTicks / 20 / 3600,
      deaths,
      pvpKills,
    };
  });

  return players;
};

// Formatear tabla para Discord
const formatTable = (players: any[]) => {
  let table = "```\n# | Jugador        | Horas | Kills | Muertes\n";
  table += "--+---------------+-------+-------+--------\n";

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
