import type { Types } from "mongoose";

import type { BookFields } from "../types/fields.js";

import Book from "../db/models/book.js";

export const BookRepository = {
  findById: async (id: string | Types.ObjectId) => {
    const findBook = await Book.findById(id).populate("user", "-password");
    if (!findBook) {
      return null;
    }
    return findBook.toObject();
  },
  createBook: async (bookFields: BookFields) => {
    const newBook = await Book.create(bookFields);
    await newBook.save();
    return newBook.toObject();
  },
};
