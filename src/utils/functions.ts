import {
  BaseInteraction,
  ChatInputCommandInteraction,
  Guild,
  TextChannel,
} from "discord.js";
import fs from "node:fs";
import path from "node:path";
export function loadFiles(filesPath: string, cb: Function) {
  const files = fs
    .readdirSync(filesPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
  for (const file of files) {
    const filePath = path.join(filesPath, file);
    const element = require(filePath);
    cb(element);
  }
}

export function loadFolders(foldersPath: string, cb: Function) {
  const folders = fs
    .readdirSync(foldersPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => path.join(dirent.parentPath, dirent.name));

  folders.forEach((folder) => loadFiles(folder, cb));
}

export function getMemberFromInteraction(interaction: BaseInteraction) {
  return interaction.guild!.members.cache.get(interaction.user.id);
}

export function getRoleByName(guild: Guild, roleName: string) {
  return guild.roles.cache.find((role) => role.name == roleName);
}
export function interactionMemberHasRole(
  interaction: BaseInteraction,
  roleName: string
): boolean {
  const role = getRoleByName(interaction.guild!, roleName);
  const member = getMemberFromInteraction(interaction);
  return role !== undefined && member !== undefined
    ? member.roles.cache.has(role.id)
    : false;
}

export function checkRoles(interaction: BaseInteraction, roles: string[]) {
  roles.forEach((role) => interactionMemberHasRole(interaction, role));
}

export function sendMsgWithCommand(
  interaction: ChatInputCommandInteraction,
  msgContent: Object
) {
  let channel: TextChannel | null = null;
  try {
    channel = interaction.channel as TextChannel;
    channel.send(msgContent);
  } catch (e) {
    return interaction.reply("You can't do this here");
  }
}
