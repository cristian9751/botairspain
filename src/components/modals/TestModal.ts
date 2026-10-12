import {
  ActionRowBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import CustomClient from "../../classes/CustomClient";
module.exports = {
  name: "TestModal",
  builder: () => {
    const nameInput = new TextInputBuilder({
      customId: "nameInput",
      label: "What is your name?",
      style: TextInputStyle.Short,
    });
    const firstRow = new ActionRowBuilder().addComponents(nameInput);
    const modal = new ModalBuilder()
      .setCustomId("TestModal")
      .setTitle("This is a test modal")
      .addComponents(firstRow as any);

    return modal;
  },

  execute: (interaction: ModalSubmitInteraction, client: CustomClient) => {
    interaction.reply({
      ephemeral: true,
      content: `${interaction.customId} sent by ${
        interaction.member?.user.username
      } whom name is ${interaction.fields.getTextInputValue("nameInput")}`,
    });
  },
};
