import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
} from "discord.js";
import CustomClient from "../../classes/CustomClient";

module.exports = {
  name: "TestButton",
  builder: () => {
    const button = new ButtonBuilder()
      .setCustomId("TestButton")
      .setStyle(ButtonStyle.Success)
      .setLabel("Test");

    const actionRow = new ActionRowBuilder().addComponents([button]);
    return actionRow;
  },
  async execute(interaction: ButtonInteraction, client: CustomClient) {
    return interaction.reply({
      ephemeral: true,
      content: `The button has been presssed by ${interaction.member?.user.username}`,
    });
  },
};
