const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add an user to the server leaderboard')
    .addSubcommandGroup((group) =>
        group
            .setName('to')
            .setDescription('Add an user to the server leaderboard')
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('leaderboard')
                    .setDescription('Add an user to the server leaderboard')
                    .addStringOption(option =>
                        option.setName('discord-username')
                            .setDescription('Discord username')
                            .setRequired(true))
                    .addStringOption(option =>
                        option.setName('summoner-name')
                            .setDescription('Summoner name')
                            .setRequired(true))
                    .addStringOption(option =>
                        option.setName('region')
                            .setDescription('Enter the region you want to use (ex: EUW for Europe West)')
                            .setRequired(true))
            )
    )

module.exports = { data }