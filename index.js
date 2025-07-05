require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// Registrar slash commands al iniciar
async function registerCommands(clientId, token) {
  const commands = [];
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log('📥 Registrando comandos...');
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );
    console.log('✅ Comandos registrados correctamente.');
  } catch (error) {
    console.error('❌ Error al registrar comandos:', error);
  }
}

client.once(Events.ClientReady, c => {
  console.log(`✅ Logged in as ${c.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN).then(() => {
  registerCommands(process.env.CLIENT_ID, process.env.DISCORD_TOKEN);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ Hubo un error al ejecutar el comando.', ephemeral: true });
  }
});

client.login(process.env.TOKEN);
