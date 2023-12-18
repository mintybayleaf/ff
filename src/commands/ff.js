const  { http } = require('../core.js');
const { SlashCommandBuilder, EmbedBuilder, italic } = require('discord.js');

const WORLD_STATUS_URL = 'https://na.finalfantasyxiv.com/lodestone/worldstatus/';
const SERVERS_URL = 'https://xivapi.com/servers';
const DATA_CENTERS_URL = 'https://xivapi.com/servers/dc';
const INSULT_URL = 'https://evilinsult.com/generate_insult.php?lang=en&type=json';


async function fetchServerEmbed() {
    const response = await http.get(SERVERS_URL);
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Final Fantasy XIV Servers')
        .setDescription('List of existing servers')
        .addFields({name: 'servers', value: response.data.join('\n'), inline: true});

    return embed;
}

async function fetchInsult() {
    const response = await http.get(INSULT_URL, { cache: false });
    const insult = response.data.insult;
    return italic(insult);
}

const data = new SlashCommandBuilder()
    .setName('ff')
    .setDescription('Fetches final fantasy XIV information')
    .addSubcommand(subcommand =>
        subcommand
            .setName('server')
            .setDescription('server info'))
    .addSubcommand(subcommand =>
        subcommand
            .setName('insult')
            .setDescription('bully your friends!'));

async function execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
    case 'server':
        await interaction.reply({ embeds: [ await fetchServerEmbed() ] });
        break;
    case 'insult':
        await interaction.reply(await fetchInsult());
        break;
    }

}

module.exports = {
    data,
    execute
};