import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../classes/CustomClient";

module.exports = {
  subcommand: "testing.modal",
  async execute(
    interaction: ChatInputCommandInteraction,
    client: CustomClient
  ) {
    let modal = await client.components.get("TestModal");
    modal = modal.builder();
    await interaction.showModal(modal);
  },
};
