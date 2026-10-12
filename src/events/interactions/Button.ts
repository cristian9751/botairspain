import { ButtonInteraction } from "discord.js";
import CustomClient from "../../classes/CustomClient";
import DiscordEvent from "../../classes/DiscordEvent";
import { roles } from "../../../configuration";
import { checkRoles } from "../../utils/functions";

export default class Button extends DiscordEvent {
  constructor(client: CustomClient) {
    super(client, DiscordEvent.interactionOptions);
  }

  async Execute(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;
    if (
      interaction.memberPermissions?.has("Administrator") ||
      checkRoles(interaction, roles[interaction.customId])
    ) {
      try {
        const button = this.client.components.get(interaction.customId);
        return await button.execute(interaction, this.client);
      } catch (e) {
        interaction.reply({
          ephemeral: true,
          content: "There is been an error",
        });
      }
    } else {
      interaction.reply({
        ephemeral: true,
        content: "You dont have permission to do this",
      });
    }
  }
}
