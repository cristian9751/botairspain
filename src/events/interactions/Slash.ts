import DiscordEvent from "../../classes/DiscordEvent";
import { ChatInputCommandInteraction, Events } from "discord.js";
import { checkRoles, interactionMemberHasRole } from "../../utils/functions";
import EventOptions from "../../classes/EventOptions";
import CustomClient from "../../classes/CustomClient";
import { roles } from "../../../configuration";
import { memberHasStaffRole } from "../../utils/airline";

export default class Slash extends DiscordEvent {
  constructor(client: CustomClient) {
    super(client, DiscordEvent.interactionOptions);
  }
  /**
   * Un comando puede declarar `permission`:
   *  - "everyone": cualquiera puede usarlo
   *  - "staff":    Administradores o roles configurados con /setadminrole
   *  - "admin":    solo Administradores
   * Sin `permission` se mantiene el comportamiento original del framework.
   */
  private async isAllowed(
    interaction: ChatInputCommandInteraction,
    command: any
  ): Promise<boolean> {
    const permission = command.permission;
    if (permission === "everyone") return true;
    if (interaction.memberPermissions?.has("Administrator")) return true;
    if (permission === "admin") return false;
    if (permission === "staff") return memberHasStaffRole(interaction);

    return (
      !!(checkRoles(interaction, (roles as any)[interaction.commandName]) as unknown) ||
      (interaction.commandName == "developer" &&
        interaction.member!.user.id == process.env.DEVELOPER_ID)
    );
  }

  async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;
    let command: any | null = this.client.commands.get(interaction.commandName);
    if (!command) {
      await interaction.reply(DiscordEvent.defaultResponse);
      return;
    }
    try {
      if (await this.isAllowed(interaction, command)) {
        let subcommand: any;
        try {
          subcommand = interaction.options.getSubcommand();
        } catch (e) {
          await command.execute(interaction, this.client);
        }
        if (subcommand) {
          subcommand = this.client.subcommands.get(
            `${interaction.commandName}.${subcommand}`
          );
          await subcommand.execute(interaction, this.client);
        }
      } else {
        await interaction.reply({
          ephemeral: true,
          content: `You don't have permissions to execute this command.`,
        });
      }
    } catch (error) {
      console.error(error);
      const content = {
        content: `There's been an errror exectuing the command`,
        ephemeral: true,
      };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(content);
      } else {
        await interaction.reply(content);
      }
    }
  }
}
