import {
  Channel,
  ChatInputCommandInteraction,
  GuildBasedChannel,
  TextChannel,
} from "discord.js";
import CustomClient from "../../classes/CustomClient";
import { sendMsgWithCommand } from "../../utils/functions";

module.exports = {
  subcommand: "testing.embed",
  async execute(
    interaction: ChatInputCommandInteraction,
    client: CustomClient
  ) {
    let embed = client.components.get("TestEmbed");
    embed = await embed.builder();
    sendMsgWithCommand(interaction, { embeds: [embed] });
    interaction.reply({
      ephemeral: true,
      content: "Embed has been sent successfully",
    });
  },
};
