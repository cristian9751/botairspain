import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import CustomClient from "../../classes/CustomClient";
import Route from "../../models/Route";
import { normalizeFlightNumber } from "../../utils/airline";

module.exports = {
  permission: "everyone",
  data: new SlashCommandBuilder()
    .setName("getroute")
    .setDescription("Muestra la ruta de un vuelo")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("flight")
        .setDescription("Número de vuelo, por ejemplo XSN123 o 123")
        .setRequired(true)
        .setMaxLength(12)
    ),

  async execute(
    interaction: ChatInputCommandInteraction,
    client: CustomClient
  ) {
    const input = interaction.options.getString("flight", true);
    const flightNumber = normalizeFlightNumber(input);
    if (!flightNumber) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: "Formato no válido. Usa `XSN123` o solo el número, por ejemplo `123`.",
      });
      return;
    }

    const route = await Route.findOne({
      guildId: interaction.guildId!,
      flightNumber,
    }).lean();

    if (!route) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: `No existe ninguna ruta con el vuelo **${flightNumber}**.`,
      });
      return;
    }

    const embed = client.components.get("RouteEmbed").builder(route);
    await interaction.reply({ embeds: [embed] });
  },
};
