import {ChatInputCommandInteraction} from "discord.js";
import CommandHandler from "../../handlers/CommandHandler";
import CustomClient from "../../classes/CustomClient";

module.exports = {
    subcommand: 'developer.reload',
    async execute(interaction : ChatInputCommandInteraction, client : CustomClient) {
        const commandHandler : CommandHandler = CommandHandler.getInstance() as CommandHandler;
        await interaction.deferReply({ephemeral : true})
        await interaction.followUp({ephemeral: true, content: 'Clearing collections'})
        client.commands.clear()
        client.subcommands.clear()
        await interaction.followUp({ ephemeral: true, content : 'Loading collections'})
        await commandHandler.loadAll(client)
        await interaction.followUp({ephemeral: true, content: 'Unregistering commands'})
        await commandHandler.unRegisterCommands(client)
        await interaction.followUp({ephemeral: true, content: 'Registering commands'})
        await commandHandler.registerCommands(client)
        await interaction.followUp({ephemeral: true, content: 'Commands have been reloaded successfully'})

    }
}
