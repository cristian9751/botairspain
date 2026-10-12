import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import CustomClient from "../../classes/CustomClient";
import Techlog from "../../models/Techlog";
import {
  MAX_TECHLOG_BYTES,
  downloadAttachment,
  normalizeRegistration,
} from "../../utils/techlog";

module.exports = {
  permission: "everyone",
  data: new SlashCommandBuilder()
    .setName("settechlog")
    .setDescription("Sube el techlog de una aeronave y lo desbloquea")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("registration")
        .setDescription("Matrícula de la aeronave, por ejemplo EC-ABC")
        .setRequired(true)
        .setMaxLength(12)
    )
    .addAttachmentOption((option) =>
      option
        .setName("file")
        .setDescription("Archivo del techlog")
        .setRequired(true)
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

    const attachment = interaction.options.getAttachment("file", true);
    if (attachment.size > MAX_TECHLOG_BYTES) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: `El archivo es demasiado grande (máximo ${MAX_TECHLOG_BYTES / 1024 / 1024} MB).`,
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const guildId = interaction.guildId!;
    const userId = interaction.user.id;
    const key = registration.key;

    const replyLocked = async (techlog: {
      registration: string;
      lockedBy?: string | null;
      lockedAt?: Date | null;
    }) => {
      await interaction.editReply({
        embeds: [client.components.get("TechlogLockedEmbed").builder(techlog)],
        allowedMentions: { parse: [] },
      });
    };

    // Comprobación previa para no descargar el archivo si ya sabemos que está
    // bloqueado por otra persona. La garantía real es el filtro atómico de abajo.
    const current = await Techlog.findOne({ guildId, key })
      .select("-data")
      .lean();
    if (current?.lockedBy && current.lockedBy !== userId) {
      await replyLocked(current);
      return;
    }

    let data: Buffer;
    try {
      data = await downloadAttachment(attachment.url, MAX_TECHLOG_BYTES);
    } catch (e) {
      console.error("Techlog attachment download failed:", e);
      await interaction.editReply({
        content:
          "No he podido leer el archivo adjunto. Inténtalo de nuevo; el techlog sigue bloqueado a tu nombre si lo habías descargado.",
      });
      return;
    }

    try {
      // Solo escribe si está libre, es nuevo o lo tienes bloqueado tú.
      // Si lo tiene otra persona, el upsert choca con el índice único (11000).
      await Techlog.findOneAndUpdate(
        { guildId, key, $or: [{ lockedBy: null }, { lockedBy: userId }] },
        {
          $set: {
            filename: attachment.name,
            contentType: attachment.contentType ?? undefined,
            size: data.length,
            data,
            uploadedBy: userId,
            lockedBy: null,
            lockedAt: null,
          },
          $setOnInsert: { registration: registration.display },
        },
        { upsert: true }
      );
    } catch (e: any) {
      if (e?.code !== 11000) throw e;
      const latest = await Techlog.findOne({ guildId, key })
        .select("-data")
        .lean();
      if (latest?.lockedBy && latest.lockedBy !== userId) {
        await replyLocked(latest);
      } else {
        await interaction.editReply({
          content:
            "Otra persona ha subido este techlog a la vez. Inténtalo de nuevo.",
        });
      }
      return;
    }

    await interaction.editReply({
      embeds: [
        client.components.get("TechlogUploadedEmbed").builder({
          registration: current?.registration ?? registration.display,
          filename: attachment.name,
          size: data.length,
        }),
      ],
    });
  },
};
