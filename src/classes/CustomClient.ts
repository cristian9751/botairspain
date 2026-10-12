import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import EventHandler from "../handlers/EventHandler";
require("dotenv").config();
const { TOKEN } = process.env;
export default class CustomClient extends Client {
  public commands: Collection<string, any> = new Collection();
  public subcommands: Collection<string, any> = new Collection();
  public components: Collection<string, any> = new Collection();

  Main() {
    super.login(TOKEN).catch((e) => {
      throw new Error(
        "There is been an error at logging in with the TOKEN: " + e
      );
    });
    EventHandler.getInstance()
      .loadAll(this)
      .catch((e) => {
        throw new Error("There is been an error loading the events");
      });
  }
}
