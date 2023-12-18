const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`Nice try fuckaroo! ${interaction.commandName} was not found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Damnit!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Something fucking failed!', ephemeral: true });
            }
        }
    },
};