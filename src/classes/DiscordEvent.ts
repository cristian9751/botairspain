import IEvent from "../interfaces/IEvent";
import CustomClient from "../classes/CustomClient";
import EventOptions from "./EventOptions";
import { Events } from "discord.js";

export default class DiscordEvent implements IEvent {
  client: CustomClient;
  name: string;
  once: boolean;

  static interactionOptions = new EventOptions(Events.InteractionCreate, false);
  static defaultResponse = {
    ephemeral: true,
    content: "This  is too old or it does not exist",
  };

  constructor(client: CustomClient, eventOptions: EventOptions) {
    this.client = client;
    this.name = eventOptions.name;
    this.once = eventOptions.once;
  }

  Execute(...args: any): void {}
}
