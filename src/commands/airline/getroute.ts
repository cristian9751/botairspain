import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import CustomClient from "../../classes/CustomClient";
import Route from "../../models/Route";

const AIRPORT_CODE = /^[A-Za-z]{3,4}$/;
// Discord permite como máximo 10 embeds por mensaje
const MAX_EMBEDS = 10;

module.exports = {
  permission: "everyone",
  data: new SlashCommandBuilder()
    .setName("getroute")
    .setDescription("Busca las rutas entre un aeropuerto de salida y uno de llegada")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("departure")
        .setDescription("Aeropuerto de salida (ICAO o IATA), por ejemplo LEVC")
        .setRequired(true)
        .setMinLength(3)
        .setMaxLength(4)
    )
    .addStringOption((option) =>
      option
        .setName("arrival")
        .setDescription("Aeropuerto de llegada (ICAO o IATA), por ejemplo LEMD")
        .setRequired(true)
        .setMinLength(3)
        .setMaxLength(4)
    ),

  async execute(
    interaction: ChatInputCommandInteraction,
    client: CustomClient
  ) {
    const departure = interaction.options.getString("departure", true).trim().toUpperCase();
    const arrival = interaction.options.getString("arrival", true).trim().toUpperCase();

    if (!AIRPORT_CODE.test(departure) || !AIRPORT_CODE.test(arrival)) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: "Salida y llegada deben ser códigos de 3 o 4 letras, por ejemplo `LEVC`.",
      });
      return;
    }

    const routes = await Route.find({
      guildId: interaction.guildId!,
      origin: departure,
      destination: arrival,
    })
      .sort({ flightNumber: 1 })
      .limit(MAX_EMBEDS + 1)
      .lean();

    if (routes.length === 0) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: `No existe ninguna ruta de **${departure}** a **${arrival}**.`,
      });
      return;
    }

    const builder = client.components.get("RouteEmbed").builder;
    const embeds = routes.slice(0, MAX_EMBEDS).map((route) => builder(route));
    await interaction.reply({
      embeds,
      content:
        routes.length > MAX_EMBEDS
          ? `Hay más de ${MAX_EMBEDS} rutas de **${departure}** a **${arrival}**; se muestran las primeras ${MAX_EMBEDS}.`
          : undefined,
    });
  },
};