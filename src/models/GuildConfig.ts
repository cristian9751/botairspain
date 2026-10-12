import { Schema, model } from "mongoose";

const guildConfigSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  // Roles que pueden usar /createroute (además de los Administradores)
  adminRoleIds: { type: [String], default: [] },
});

export default model("GuildConfig", guildConfigSchema);
