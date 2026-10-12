import { Schema, model, InferSchemaType } from "mongoose";

const routeSchema = new Schema(
  {
    guildId: { type: String, required: true },
    // Siempre normalizado: XSN + número (ej. XSN123)
    flightNumber: { type: String, required: true, uppercase: true, trim: true },
    origin: { type: String, required: true, uppercase: true, trim: true },
    destination: { type: String, required: true, uppercase: true, trim: true },
    aircraft: { type: String, required: true, trim: true },
    // Texto libre de la ruta (waypoints, aerovías, SID/STAR...)
    route: { type: String, trim: true, default: "" },
    // Duración estimada en minutos
    duration: { type: Number, min: 1 },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

routeSchema.index({ guildId: 1, flightNumber: 1 }, { unique: true });

export type RouteData = InferSchemaType<typeof routeSchema>;
export default model("Route", routeSchema);
