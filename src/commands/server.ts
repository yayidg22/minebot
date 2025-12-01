import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { getMinecraftServerDataService } from "../services/minecraft-server";

const OVERRIDE_MINECRAFT_VERSION = process.env.MINECRAFT_VERSION;

const handleInteraction = async (interaction: ChatInputCommandInteraction) => {
  try {
    const serverData = await getMinecraftServerDataService();

    const statusEmoji = serverData?.online ? "🟢 Online" : "🔴 Offline";
    const motd = serverData?.motd?.clean ?? "Sin MOTD";

    const embed = new EmbedBuilder()
      .setTitle("Estado del Servidor Minecraft")
      .setColor(0x00aaff)
      .addFields(
        {
          name: "Estado",
          value: statusEmoji,
          inline: true,
        },
        {
          name: "Cliente",
          value: `${
            OVERRIDE_MINECRAFT_VERSION ?? serverData?.version?.name_raw
          }`,
          inline: false,
        },
        {
          name: "MOTD",
          value: motd,
          inline: false,
        },
        {
          name: "IP",
          value: `${serverData?.host}:${serverData?.port}`,
          inline: true,
        },
        {
          name: "Jugadores",
          value: `${serverData?.players.online}/${serverData?.players.max}`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({ text: "Actualizado" });

    return interaction.reply({ embeds: [embed] });
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
