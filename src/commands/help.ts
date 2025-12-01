import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import commands from ".";

const handleInteraction = async (interaction: ChatInputCommandInteraction) => {
  try {
    const commandsList = [];

    for (const command of commands) {
      commandsList.push({
        name: `/${command.data.name}`,
        description: command.data.description,
      });
    }

    let table = "```\n# | Comando | Descripcion\n";
    table += "--+--------------+-------+-------+--------\n";

    commandsList.forEach((p, i) => {
      table += `${String(i + 1).padEnd(2)}| ${p.name.padEnd(5)}| \n`;
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
    .setName("help")
    .setDescription("Muestra la lista de comandos disponibles"),
  async execute(interaction: ChatInputCommandInteraction) {
    await handleInteraction(interaction);
  },
};
