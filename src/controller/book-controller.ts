import type { Request, Response } from "express";

import streamifier from "streamifier";

import type { BookFields } from "../types/fields.js";

import Book from "../db/models/book.js";
import cloudinary from "../lib/cloudinary.js";
import { BookServices } from "../services/book-services.js";

const BookController = {
  getAllBooks: async (_req: Request, res: Response) => {
    try {
      const books = await Book.find();
      res.status(200).json({ error: false, books, message: "Success getting books" });
    }
    catch (err) {
      res.status(500).json({ error: true, message: (err as Error).message || "Something went wrong" });
    }
  },
  create: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      if (!userId) {
        throw new Error("User does not exist");
      }
      const body = req.body as BookFields;
      const image = req.files?.image;
      if (!image) {
        throw new Error("Image are required");
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "books" },
          (error, result) => {
            if (error)
              reject(error);
            else resolve(result);
          },
        );

        streamifier.createReadStream((image as any).data).pipe(uploadStream);
      });

      const imageUrl = (uploadResult as any).secure_url;
      if (!imageUrl) {
        throw new Error("Failed to upload the book image");
      }
      const book = await BookServices.createBook({ ...body, image: imageUrl, user: userId });
      if (!book) {
        throw new Error("Failed to create book!");
      }
      res.status(200).send({
        error: false,
        data: book,
        message: "Success",
      });
    }
    catch (e) {
      res.status(500).json({ error: true, message: (e as Error).message || "Something went wrong" });
    }
  },
};

export default BookController;
