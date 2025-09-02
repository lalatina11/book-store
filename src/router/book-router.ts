import { Router } from "express";

import BookController from "../controller/book-controller.js";
import { authMiddleware } from "../middlewares.js";

const router = Router();

router.get("/", BookController.getAllBooks);
router.post("/", authMiddleware, BookController.create);
router.patch("/:id", authMiddleware, BookController.update);
router.delete("/:id", authMiddleware, BookController.delete);

export default router;
