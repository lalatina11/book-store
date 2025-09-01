import type { BookFields } from "../types/fields.js";

import { BookRepository } from "../repositories/book-repositories.js";

export const BookServices = {
  createBook: async (bookFields: BookFields) => {
    const { title, caption, image, rating } = bookFields;
    if (!title || !caption || !image || !rating) {
      throw new Error(`All fields are required.`);
    }
    const newBook = await BookRepository.createBook(bookFields);
    if (!newBook) {
      throw new Error("Failed to create book.");
    }
    const { _id: id } = newBook;
    return BookRepository.findById(id);
  },
};
