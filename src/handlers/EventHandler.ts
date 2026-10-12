import  CustomClient  from "../classes/CustomClient";
import Handler from "../classes/Handler";
import path from "node:path";
import EventOptions from "../classes/EventOptions";
import {Events} from "discord.js";

export default class EventHandler extends Handler {


    constructor() {
        super('events')
    }
    protected  load(eventFile: any, client: CustomClient): Promise<void> | void {
        const event = new eventFile.default(client)
        if(event.once ) {
            client.once(event.name , (...args : any[] ) => event.Execute(...args))
        } else {
            client.on(event.name , (...args : any[] ) => event.Execute(...args))
        }
    }

}
