import Handler from "../classes/Handler";
import CustomClient from "../classes/CustomClient";

export default interface IHandler {
    filesPath : string
    loadAll : (client : CustomClient) => void
}
