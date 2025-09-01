import type { Types } from "mongoose";

export type UserFields = {
  username: string;
  email: string;
  password?: string | null;
  avatar?: string | null;
};

export type BookFields = {
  title: string;
  caption: string;
  image: string;
  rating: number;
  user: string | Types.ObjectId;
};
