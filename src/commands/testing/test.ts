import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import CustomClient from "../../classes/CustomClient";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("testing")
    .setDescription("Command for testing")
    .addSubcommand((subcommand) =>
      subcommand.setName("modal").setDescription("Testing modals")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("embed").setDescription("Testing embeds")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("button").setDescription("Testing buttons")
    ),
};
