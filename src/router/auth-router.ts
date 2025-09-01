import express from "express";

import AuthController from "../controller/auth-controller.js";
import { authMiddleware } from "../middlewares.js";

const route = express.Router();

route.get("/current-user", authMiddleware, AuthController.getCurrentUser);

route.post("/sign-up", AuthController.signUp);

route.post("/sign-in", AuthController.signIn);

export default route;
