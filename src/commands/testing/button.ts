import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  TextChannel,
} from "discord.js";
import CustomClient from "../../classes/CustomClient";
import { sendMsgWithCommand } from "../../utils/functions";

module.exports = {
  subcommand: "testing.button",
  async execute(
    interaction: ChatInputCommandInteraction,
    client: CustomClient
  ) {
    let testButton = client.components.get("TestButton");
    testButton = testButton.builder();
    sendMsgWithCommand(interaction, {
      components: [testButton],
    });

    interaction.reply({
      ephemeral: true,
      content: "The test button has been sent",
    });
  },
};
