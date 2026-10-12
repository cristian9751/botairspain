import { ChatInputCommandInteraction } from "discord.js";
import GuildConfig from "../models/GuildConfig";

/**
 * Acepta "XSN123", "xsn123", "xsn 123", "XSN-123" o solo "123"
 * y devuelve "XSN123". Devuelve null si el formato no es válido.
 */
export function normalizeFlightNumber(input: string): string | null {
  const match = /^(?:XSN)?[\s-]*(\d{1,5})$/i.exec(input.trim());
  return match ? `XSN${match[1]}` : null;
}

export async function getStaffRoleIds(guildId: string): Promise<string[]> {
  const config = await GuildConfig.findOne({ guildId }).lean();
  return config?.adminRoleIds ?? [];
}

/** True si el miembro tiene alguno de los roles configurados con /setadminrole. */
export async function memberHasStaffRole(
  interaction: ChatInputCommandInteraction
): Promise<boolean> {
  if (!interaction.guildId || !interaction.member) return false;
  const staffRoleIds = await getStaffRoleIds(interaction.guildId);
  if (staffRoleIds.length === 0) return false;

  // interaction.member es un GuildMember (roles.cache) o un miembro de la API (roles: string[])
  const roles = interaction.member.roles;
  const memberRoleIds = Array.isArray(roles) ? roles : [...roles.cache.keys()];
  return memberRoleIds.some((id) => staffRoleIds.includes(id));
}
