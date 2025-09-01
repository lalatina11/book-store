import { Router } from "express";

import BookController from "../controller/book-controller.js";
import { authMiddleware } from "../middlewares.js";

const router = Router();

router.get("/", BookController.getAllBooks);
router.post("/", authMiddleware, BookController.create);

export default router;
