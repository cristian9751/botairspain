import CustomClient from "./classes/CustomClient";
import {GatewayIntentBits} from "discord.js";

const client: CustomClient = new CustomClient({
    intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.GuildMembers
    ],
})


client.Main()



