import { EmbedBuilder } from "discord.js";

module.exports = {
  name: "TechlogLockedEmbed",
  builder: (techlog: {
    registration: string;
    lockedBy?: string | null;
    lockedAt?: Date | null;
  }) => {
    const since = techlog.lockedAt
      ? ` <t:${Math.floor(techlog.lockedAt.getTime() / 1000)}:R>`
      : "";
    return new EmbedBuilder()
      .setColor("Red")
      .setTitle(`Techlog ${techlog.registration} bloqueado`)
      .setDescription(
        `Lo descargó <@${techlog.lockedBy}>${since} y todavía no lo ha subido.\n` +
          `No se puede descargar ni subir hasta que lo suba con \`/settechlog\`.`
      );
  },
};
