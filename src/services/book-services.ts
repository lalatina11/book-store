import type { UploadedFile } from "express-fileupload";

import streamifier from "streamifier";

import type { BookFields } from "../types/fields.js";

import cloudinary from "../lib/cloudinary.js";
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
  bookImageUploader: async (image: UploadedFile | UploadedFile[]) => {
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

    return (uploadResult as any).secure_url;
  },
};
