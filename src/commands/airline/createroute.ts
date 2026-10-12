import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import CustomClient from "../../classes/CustomClient";
import Route from "../../models/Route";
import { normalizeFlightNumber } from "../../utils/airline";

const AIRPORT_CODE = /^[A-Za-z]{3,4}$/;

module.exports = {
  permission: "staff",
  data: new SlashCommandBuilder()
    .setName("createroute")
    .setDescription("Crea una nueva ruta")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("flight")
        .setDescription("Número de vuelo, por ejemplo XSN123 o 123")
        .setRequired(true)
        .setMaxLength(12)
    )
    .addStringOption((option) =>
      option
        .setName("origin")
        .setDescription("Aeropuerto de origen (ICAO o IATA), por ejemplo LEVC")
        .setRequired(true)
        .setMinLength(3)
        .setMaxLength(4)
    )
    .addStringOption((option) =>
      option
        .setName("destination")
        .setDescription("Aeropuerto de destino (ICAO o IATA), por ejemplo LEMD")
        .setRequired(true)
        .setMinLength(3)
        .setMaxLength(4)
    )
    .addStringOption((option) =>
      option
        .setName("aircraft")
        .setDescription("Aeronave, por ejemplo A320")
        .setRequired(true)
        .setMaxLength(50)
    )
    .addStringOption((option) =>
      option
        .setName("route")
        .setDescription("Ruta (waypoints, aerovías, SID/STAR...)")
        .setMaxLength(1000)
    )
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription("Duración estimada en minutos")
        .setMinValue(1)
        .setMaxValue(2000)
    ),

  async execute(
    interaction: ChatInputCommandInteraction,
    client: CustomClient
  ) {
    const flightNumber = normalizeFlightNumber(
      interaction.options.getString("flight", true)
    );
    const origin = interaction.options.getString("origin", true).trim();
    const destination = interaction.options.getString("destination", true).trim();

    if (!flightNumber) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: "Formato de vuelo no válido. Usa `XSN123` o solo el número.",
      });
      return;
    }
    if (!AIRPORT_CODE.test(origin) || !AIRPORT_CODE.test(destination)) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: "Origen y destino deben ser códigos de 3 o 4 letras.",
      });
      return;
    }

    const guildId = interaction.guildId!;
    if (await Route.exists({ guildId, flightNumber })) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: `Ya existe una ruta con el vuelo **${flightNumber}**.`,
      });
      return;
    }

    const duration = interaction.options.getInteger("duration");
    try {
      await Route.create({
        guildId,
        flightNumber,
        origin,
        destination,
        aircraft: interaction.options.getString("aircraft", true),
        route: interaction.options.getString("route") ?? "",
        duration: duration ?? undefined,
        createdBy: interaction.user.id,
      });
    } catch (e: any) {
      // Dos creaciones simultáneas: el índice único evita el duplicado
      if (e?.code === 11000) {
        await interaction.reply({
          flags: MessageFlags.Ephemeral,
          content: `Ya existe una ruta con el vuelo **${flightNumber}**.`,
        });
        return;
      }
      throw e;
    }

    const embed = client.components
      .get("RouteCreatedEmbed")
      .builder({ flightNumber, origin, destination });
    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },
};
