import { EmbedBuilder } from "discord.js";
import type { RouteData } from "../../models/Route";

module.exports = {
  name: "RouteEmbed",
  builder: (route: RouteData) => {
    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`${route.flightNumber}: ${route.origin} → ${route.destination}`)
      .addFields(
        { name: "Origen", value: route.origin, inline: true },
        { name: "Destino", value: route.destination, inline: true },
        { name: "Aeronave", value: route.aircraft, inline: true }
      );

    if (route.duration) {
      const hours = Math.floor(route.duration / 60);
      const minutes = route.duration % 60;
      embed.addFields({
        name: "Duración estimada",
        value: hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`,
        inline: true,
      });
    }

    embed.addFields({
      name: "Ruta",
      value: route.route ? route.route.slice(0, 1024) : "Sin ruta definida",
    });

    return embed;
  },
};
