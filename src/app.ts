import cors from "cors";
import express from "express";
import expressFileUpload from "express-fileupload";
import helmet from "helmet";
import morgan from "morgan";

import api from "./api/index.js";
import * as middlewares from "./middlewares.js";
import { runDB } from "./middlewares.js";
import AuthRouter from "./router/auth-router.js";
import BookRouter from "./router/book-router.js";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(expressFileUpload());

app.use("/api/auth", runDB, AuthRouter);
app.use("/api/book", runDB, BookRouter);

app.get("/", (_, res) => {
  res.json({
    error: false,
    message: "IT IS WORK, YOU DID IT!",
  });
});

app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
// app.use(middlewares.runDB);

export default app;
