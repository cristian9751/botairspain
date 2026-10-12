import IHandler from "../interfaces/IHandler";
import CustomClient from "../classes/CustomClient";
import path from "node:path";
import { loadFiles, loadFolders } from "../utils/functions";
require("dotenv").config();

export default abstract class Handler implements IHandler {
  filesPath: string;
  protected constructor(filesPath: string) {
    const changingPath = process.env.ENV_DEVELOPMENT ? "src" : "dist";
    this.filesPath = path.join(
      path.join(path.resolve(), changingPath),
      filesPath
    );
  }
  protected abstract load(
    element: any,
    client: CustomClient
  ): Promise<void> | void;
  public static getInstance<T extends Handler>(this: new () => T): T {
    if (!(this as any)._handler) {
      (this as any)._handler = new this();
    }
    return (this as any)._handler as T;
  }

  public async loadAll(client: CustomClient): Promise<void> {
    try {
      loadFiles(this.filesPath!, (element: any) => {
        this.load(element, client);
      });
      loadFolders(this.filesPath!, (element: any) => {
        this.load(element, client);
      });
    } catch (error) {
      console.error(error);
      console.log(
        `There is been an error loading ${this.constructor.name} : ${error}`
      );
    }
  }
}
