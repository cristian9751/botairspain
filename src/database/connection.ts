import { connect } from "mongoose";

const DEFAULT_URI = "mongodb://127.0.0.1:27017/xsn-airline";

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGO_URI ?? DEFAULT_URI;
  await connect(uri);
  console.log("MongoDB connected");
}
