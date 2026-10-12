import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import CustomClient from "../../classes/CustomClient";
import Techlog from "../../models/Techlog";
import { normalizeRegistration } from "../../utils/techlog";

module.exports = {
  permission: "everyone",
  data: new SlashCommandBuilder()
    .setName("gettechlog")
    .setDescription("Descarga el techlog de una aeronave y lo bloquea a tu nombre")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("registration")
        .setDescription("Matrícula de la aeronave, por ejemplo EC-ABC")
        .setRequired(true)
        .setMaxLength(12)
    ),

  async execute(
    interaction: ChatInputCommandInteraction,
    client: CustomClient
  ) {
    const registration = normalizeRegistration(
      interaction.options.getString("registration", true)
    );
    if (!registration) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: "Matrícula no válida. Usa un formato como `EC-ABC`.",
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const guildId = interaction.guildId!;
    const userId = interaction.user.id;
    const key = registration.key;

    // Un único paso atómico: solo se bloquea si está libre o ya es tuyo.
    // Devuelve el documento anterior, así sabemos si ya lo tenías bloqueado.
    const techlog = await Techlog.findOneAndUpdate(
      { guildId, key, $or: [{ lockedBy: null }, { lockedBy: userId }] },
      { $set: { lockedBy: userId, lockedAt: new Date() } }
    );

    if (!techlog) {
      const existing = await Techlog.findOne({ guildId, key })
        .select("-data")
        .lean();
      if (!existing) {
        await interaction.editReply({
          content: `No hay ningún techlog para **${registration.display}**. Puedes subirlo con \`/settechlog\`.`,
        });
        return;
      }
      await interaction.editReply({
        embeds: [client.components.get("TechlogLockedEmbed").builder(existing)],
        allowedMentions: { parse: [] },
      });
      return;
    }

    try {
      await interaction.editReply({
        embeds: [
          client.components.get("TechlogDownloadedEmbed").builder(techlog),
        ],
        files: [
          new AttachmentBuilder(Buffer.from(techlog.data), {
            name: techlog.filename,
          }),
        ],
      });
    } catch (e) {
      // Si no se pudo entregar el archivo, no dejamos el techlog bloqueado
      // (salvo que ya lo tuvieras bloqueado de antes)
      if (techlog.lockedBy !== userId) {
        await Techlog.updateOne(
          { guildId, key, lockedBy: userId },
          { $set: { lockedBy: null, lockedAt: null } }
        );
      }
      throw e;
    }
  },
};
