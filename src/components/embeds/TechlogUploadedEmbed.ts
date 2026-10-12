import { EmbedBuilder } from "discord.js";

module.exports = {
  name: "TechlogUploadedEmbed",
  builder: (techlog: { registration: string; filename: string; size: number }) => {
    return new EmbedBuilder()
      .setColor("Green")
      .setTitle(`Techlog ${techlog.registration} subido`)
      .setDescription(
        `Archivo: **${techlog.filename}** (${(techlog.size / 1024).toFixed(1)} KB)\n` +
          `El techlog está desbloqueado y disponible.`
      );
  },
};
