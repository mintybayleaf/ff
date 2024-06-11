const  { http } = require('../core.js');
const { SlashCommandBuilder, EmbedBuilder, italic } = require('discord.js');
const jsdom = require('jsdom');

const WORLD_STATUS_URL = 'https://na.finalfantasyxiv.com/lodestone/worldstatus/';
const INSULT_URL = 'https://evilinsult.com/generate_insult.php?lang=en&type=json';

async function fetchServerEmbeds() {
    const response = await http.get(WORLD_STATUS_URL);
    const dom = new jsdom.JSDOM(response.data);
    const worlds = [...dom.window.document.querySelectorAll('.world-list__world_name')].map(item => item.textContent.trim());
    const categories = [...dom.window.document.querySelectorAll('.world-list__world_category')].map(item => item.textContent.trim());
    const worldMap = Object.assign(...worlds.map((world, i) => ({[world]: categories[i]})));
    const openServerEmbed = new EmbedBuilder().setColor(0xa8e6cf).setTitle('Open Servers');
    const closedServerEmbed = new EmbedBuilder().setColor(0xff8b94).setTitle('Closed Servers');
    const openServers =  Object.keys(worldMap).filter((world) => worldMap[world].toLowerCase() !== 'congested');
    const closedServers =  Object.keys(worldMap).filter((world) => worldMap[world].toLowerCase() === 'congested');
    openServerEmbed.addFields({name: 'Servers', value: openServers.join('\n'), inline: true});
    closedServerEmbed.addFields({name: 'Servers', value: closedServers.join('\n'), inline: true});
    return [openServerEmbed, closedServerEmbed];
}

async function fetchInsult() {
    const response = await http.get(INSULT_URL, { cache: false });
    const insult = response.data.insult;
    return italic(insult);
}

let eventTimer = null;

async function createEvent(interaction) {
    if (!eventTimer) {
        eventTimer = setInterval(async function() {
            await interaction.followUp({ embeds: await fetchServerEmbeds() });
            const now = new Date();
            if (now.getUTCHours() - 8 == 9) {
                console.log('EVENT');
            }
        }, 20000);
    }
    return `Event created in channel by user ${interaction.user.username}!`;
}

async function stopEvent() {
    if (eventTimer) clearInterval(eventTimer);
    return 'Event Stopped!';
}

const data = new SlashCommandBuilder()
    .setName('ff')
    .setDescription('Final Fantasy Bot')
    .addSubcommand(subcommand =>
        subcommand
            .setName('servers')
            .setDescription('current server statuses'))
    .addSubcommand(subcommand =>
        subcommand
            .setName('insult')
            .setDescription('bully your friends!'))
    .addSubcommand(subcommand =>
        subcommand
            .setName('on')
            .setDescription('Turn the daily reporting feature on in channel'))
    .addSubcommand(subcommand =>
        subcommand
            .setName('off')
            .setDescription('Turn the daily reporting feature on'));

async function execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
    case 'server':
        await interaction.reply({ embeds: await fetchServerEmbeds() });
        break;
    case 'insult':
        await interaction.reply(await fetchInsult());
        break;
    case 'on':
        await interaction.deferReply();
        await createEvent(interaction);
        break;
    case 'off':
        await interaction.reply(await stopEvent());
        break;
    }

}

module.exports = {
    data,
    execute
};