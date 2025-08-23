import { Router } from "express";

import BookController from "../controller/book-controller.js";

const router = Router();

router.get("/", () => {

});

router.post("/", BookController.create);

export default router;
