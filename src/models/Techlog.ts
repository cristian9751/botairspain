import { Schema, model } from "mongoose";

const techlogSchema = new Schema(
  {
    guildId: { type: String, required: true },
    // Matrícula sin guiones ni espacios (EC-ABC y ECABC son el mismo avión)
    key: { type: String, required: true },
    // Matrícula tal y como se escribió al crear el techlog (ej. EC-ABC)
    registration: { type: String, required: true },

    // El archivo se guarda en Mongo: las URLs de adjuntos de Discord caducan
    filename: { type: String, required: true },
    contentType: { type: String },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
    uploadedBy: { type: String, required: true },

    // Quién lo tiene descargado. null = disponible
    lockedBy: { type: String, default: null },
    lockedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

techlogSchema.index({ guildId: 1, key: 1 }, { unique: true });

export default model("Techlog", techlogSchema);
