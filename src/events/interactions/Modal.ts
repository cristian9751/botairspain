import { ModalSubmitInteraction } from "discord.js";
import CustomClient from "../../classes/CustomClient";
import DiscordEvent from "../../classes/DiscordEvent";
import { checkRoles } from "../../utils/functions";
import { roles } from "../../../configuration";

export default class Modal extends DiscordEvent {
  constructor(client: CustomClient) {
    super(client, DiscordEvent.interactionOptions);
  }

  async Execute(interaction: ModalSubmitInteraction) {
    if (!interaction.isModalSubmit()) return;
    const modal = this.client.components.get(interaction.customId);
    if (
      interaction.memberPermissions?.has("Administrator") ||
      checkRoles(interaction, roles[modal.name])
    ) {
      try {
        await modal.execute(interaction, this.client);
      } catch (e) {
        await interaction.reply(
          "There is been an error when submitting the modal"
        );
      }
    } else {
      await interaction.reply("You dont have permission to do this");
    }
  }
}
