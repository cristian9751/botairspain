import IEventOptions from "../interfaces/IEventOptions";
import { Events } from "discord.js";
export default class EventOptions implements IEventOptions {
  name: Events;
  once: boolean;

  constructor(name: Events, once: boolean) {
    this.name = name;
    this.once = once;
  }
}
