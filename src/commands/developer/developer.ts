import { SlashCommandBuilder } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("developer")
    .setDescription("Developer commands")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("reload")
        .setDescription("Commands meant for the developer")
    ),
};
