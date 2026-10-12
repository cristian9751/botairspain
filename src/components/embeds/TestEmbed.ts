import { EmbedBuilder } from "discord.js";

module.exports = {
  name: "TestEmbed",
  builder: () => {
    return new EmbedBuilder()
      .setColor("Blue")
      .setDescription("This is  a test embed")
      .addFields({ name: "Field title", value: "Some value field " });
  },
};
