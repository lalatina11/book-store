import type { Request, Response } from "express";

import type { BookFields } from "../types/fields.js";

import Book from "../db/models/book.js";
import { BookRepository } from "../repositories/book-repositories.js";
import { BookServices } from "../services/book-services.js";

const BookController = {
  getAllBooks: async (_req: Request, res: Response) => {
    try {
      const books = await Book.find().populate("user", "-password");
      res.status(200).json({ error: false, books, message: "Success getting books" });
    }
    catch (err) {
      res.status(500).json({ error: true, message: (err as Error).message || "Something went wrong" });
    }
  },
  create: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const body = req.body as BookFields;
      const image = req.files?.image;
      if (!image) {
        throw new Error("Image are required");
      }
      const imageUrl = await BookServices.bookImageUploader(image);
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
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const book = await BookRepository.findById(id);
      if (!book) {
        throw new Error("Failed to find book!");
      }

      const userId = (req as any).userId.toString();
      const bookUserId = book.user._id.toString();
      if (userId !== bookUserId) {
        throw new Error("You don't have permission to update this book!");
      }
      const { title, rating, caption } = req.body as BookFields;
      let image = book.image;
      const imageFiles = req.files?.image;
      if (imageFiles) {
        image = await BookServices.bookImageUploader(imageFiles);
      }
      const updatedBook = await Book.findByIdAndUpdate(book._id, {
        title: title || book.title,
        caption: caption || book.caption,
        rating: rating || book.rating,
        image,
      }, { new: true }).populate("user", "-password");
      if (!updatedBook) {
        throw new Error("Failed to update the book!");
      }
      res.status(201).json({ error: false, data: updatedBook.toObject(), message: "Success" });
    }
    catch (err) {
      res.status(400).json({ error: true, message: (err as Error).message || "Something went wrong" });
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new Error("You don't have permission to delete the book!");
      }
      const book = await BookRepository.findById(id);
      if (!book) {
        throw new Error("Failed to find book!");
      }
      await Book.findByIdAndDelete(book._id);
      res.status(200).json({ error: false, message: "Success" });
    }
    catch (err) {
      res.status(400).json({ error: true, message: (err as Error).message || "Something went wrong" });
    }
  },
};

export default BookController;
