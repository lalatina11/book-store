import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import api from "./api/index.js";
import * as middlewares from "./middlewares.js";
import AuthRouter from "./router/auth-router.js";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/auth", AuthRouter);

app.get("/", (_, res) => {
  res.json({
    error: false,
    message: "IT IS WORK, YOU DID IT!",
  });
});

app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
