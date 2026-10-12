import CustomClient from "../classes/CustomClient";
import Handler from "../classes/Handler";

export default class ComponentHandler extends Handler {
  protected load(component: any, client: CustomClient): Promise<void> | void {
    if ("name" in component && "builder" in component) {
      client.components.set(component.name, component);
    }
  }

  constructor() {
    super("components");
  }
}
