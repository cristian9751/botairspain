import {
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import GuildConfig from "../../models/GuildConfig";

module.exports = {
  permission: "admin",
  data: new SlashCommandBuilder()
    .setName("setadminrole")
    .setDescription("Define qué roles pueden crear rutas")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Rol que podrá usar /createroute")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Añadir (por defecto) o quitar el rol")
        .addChoices(
          { name: "Añadir", value: "add" },
          { name: "Quitar", value: "remove" }
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const role = interaction.options.getRole("role", true);
    const action = interaction.options.getString("action") ?? "add";
    const guildId = interaction.guildId!;

    // @everyone tiene el mismo id que el servidor: darle acceso abriría el comando a todos
    if (role.id === guildId) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: "No puedes usar @everyone como rol de administración.",
      });
      return;
    }

    const config = await GuildConfig.findOneAndUpdate(
      { guildId },
      action === "remove"
        ? { $pull: { adminRoleIds: role.id } }
        : { $addToSet: { adminRoleIds: role.id } },
      { upsert: true, new: true }
    );

    const list = config.adminRoleIds.length
      ? config.adminRoleIds.map((id) => `<@&${id}>`).join(", ")
      : "ninguno";

    await interaction.reply({
      flags: MessageFlags.Ephemeral,
      allowedMentions: { parse: [] },
      content:
        `${action === "remove" ? "Rol quitado" : "Rol añadido"}: <@&${role.id}>\n` +
        `Roles que pueden crear rutas: ${list}`,
    });
  },
};
