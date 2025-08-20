import app from "./app.js";
import { DbConnection } from "./db/index.js";
import { ENV } from "./env.js";

const port = ENV.PORT;
const server = app.listen(port, async () => {
  await DbConnection();
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});

server.on("error", (err) => {
  if ("code" in err && err.code === "EADDRINUSE") {
    console.error(`Port ${ENV.PORT} is already in use. Please choose another port or stop the process using it.`);
  }
  else {
    console.error("Failed to start server:", err);
  }
  process.exit(1);
});
