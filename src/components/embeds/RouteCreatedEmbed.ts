import { EmbedBuilder } from "discord.js";
import type { RouteData } from "../../models/Route";

module.exports = {
  name: "RouteCreatedEmbed",
  builder: (route: Pick<RouteData, "flightNumber" | "origin" | "destination">) => {
    return new EmbedBuilder()
      .setColor("Green")
      .setTitle(`Ruta creada: ${route.flightNumber}`)
      .setDescription(
        `${route.origin.toUpperCase()} → ${route.destination.toUpperCase()}`
      );
  },
};
