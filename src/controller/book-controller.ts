import type { Request, Response } from "express";

import type { BookFields } from "../types/fields.js";

const BookController = {
  create: async (req: Request, res: Response) => {
    const body = req.body as BookFields;
    res.status(200).send(body);
  },
};

export default BookController;
