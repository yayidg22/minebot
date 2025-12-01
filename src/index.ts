import {
  Collection,
  Client,
  Events,
  GatewayIntentBits,
  MessageFlags,
  REST,
  Routes,
} from "discord.js";
import CommandList from "./commands";

const DISCORD_APP_ID = process.env.DISCORD_APP_ID!;
const DISCORD_APP_TOKEN = process.env.DISCORD_APP_TOKEN!;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

/* handle the response of commands interactions */
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

const registerCommandsInDiscord = async () => {
  const COMMANDS = [];
  for (const command of CommandList) {
    client.commands.set(command.data.name, command);
    COMMANDS.push({
      name: command.data.name,
      description: command.data.description,
    });
  }
  const rest = new REST().setToken(DISCORD_APP_TOKEN);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(DISCORD_APP_ID), {
      body: COMMANDS,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};

const bootstrap = async () => {
  try {
    await registerCommandsInDiscord();
    await client.login(DISCORD_APP_TOKEN);
  } catch (error) {
    console.log("Error: ", error);
    process.exit(1);
  }
};

bootstrap();
