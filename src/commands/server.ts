import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import { getMinecraftServerDataService } from "../services/minecraft-server";

const OVERRIDE_MINECRAFT_VERSION = process.env.MINECRAFT_VERSION;

const handleInteraction = async (
  interaction: ChatInputCommandInteraction
) => {
  try {
    const serverData = await getMinecraftServerDataService();

    const response = `
    Cliente: ${OVERRIDE_MINECRAFT_VERSION ?? serverData?.version?.name_raw}
    IP: ${serverData?.host}:${serverData?.port}
    Jugadores: ${serverData?.players.online}/${serverData?.players.max}
    `;

    await interaction.reply(response);
  } catch (error) {
    console.log(error);
    await interaction.reply("Error al obtener la informacion del servidor");
  }
};

export default {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Muestra informacion del servidor de minecraft"),
  async execute(interaction: ChatInputCommandInteraction) {
    await handleInteraction(interaction);
  },
};
