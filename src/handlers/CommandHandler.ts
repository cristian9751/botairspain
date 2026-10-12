import CustomClient from "../classes/CustomClient";
import Handler from "../classes/Handler";
import { ApplicationCommand, Guild, REST, Routes } from "discord.js";

export default class CommandHandler extends Handler {
  load(command: any, client: CustomClient): void {
    if ("subcommand" in command && "execute" in command) {
      client.subcommands.set(command.subcommand, command);
    } else if ("data" in command) {
      client.commands.set(command.data.name, command);
    }
  }

  constructor() {
    super("commands");
  }
  async registerCommands(client: CustomClient): Promise<void> {
    const rest: REST = new REST().setToken(process.env.TOKEN!);
    let commands = [...client.commands.values()].map((command) =>
      command.data.toJSON()
    );
    await (async () => {
      if (commands.length <= 0) {
        return console.log("There are no commands to refresh");
      }
      try {
        console.log(
          `Started refreshing ${commands.length} application (/) commands.`
        );
        const data: any = await rest.put(
          Routes.applicationCommands(process.env.CLIENT_ID!),
          { body: commands }
        );

        client.guilds.cache.forEach((guild) =>
          rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID!, guild.id),
            { body: commands }
          )
        );
        console.log(
          `Successfully reloaded ${data.length} application (/) commands.`
        );
      } catch (e) {
        console.error(e);
      }
    })();
  }

  async unRegisterCommands(client: CustomClient): Promise<void> {
    const rest: REST = new REST().setToken(process.env.TOKEN!);
    client.guilds.cache.forEach((guild) => {
      rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID!, guild.id),
        { body: [] }
      );
    });
    console.log("Successfully deleted all the commands");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
      body: [],
    });
  }
}
