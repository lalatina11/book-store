import mongoose from "mongoose";

import { ENV } from "../env.js";

export async function DbConnection() {
  try {
    const connection = await mongoose.connect(ENV.DATABASE_URL);
    /* eslint-disable no-console */
    console.log(`Database connected on HOST: ${connection.connection.host}`);
    return connection;
  }
  catch (err) {
    console.log(err);
    return null;
  }
}
