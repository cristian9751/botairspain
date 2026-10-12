import { EmbedBuilder } from "discord.js";

module.exports = {
  name: "TechlogDownloadedEmbed",
  builder: (techlog: { registration: string; filename: string }) => {
    return new EmbedBuilder()
      .setColor("Orange")
      .setTitle(`Techlog ${techlog.registration}`)
      .setDescription(
        `Archivo: **${techlog.filename}**\n` +
          `Queda **bloqueado a tu nombre**: nadie más podrá descargarlo ni subirlo ` +
          `hasta que lo subas con \`/settechlog\`.`
      );
  },
};
