import mongoose from "mongoose";

import { ENV } from "../env.js";

const MONGODB_URI = ENV.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in your .env");
}

let cached = (globalThis as any).mongoose;

if (!cached) {
  cached = (globalThis as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn)
    return cached.conn;

  if (!cached.promise) {
    cached.promise = await mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
