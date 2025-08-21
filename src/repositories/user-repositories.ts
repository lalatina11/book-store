import type { UserFields } from "../types/index.js";

import User from "../db/models/user.js";

const UserRepositories = {
  create: async (fields: UserFields & { password: string }) => {
    const { username, email, password, avatar } = fields;
    const newUser = new User({ email, password, username, avatar });
    const user = await newUser.save();
    return user.toObject();
  },
  findById: async (id: string) => {
    const user = await User.findById({ _id: id });
    if (!user)
      return null;
    return user.toObject();
  },
  findByUsername: async (username: string) => {
    const user = await User.findOne({ username });
    if (!user)
      return null;
    return user.toObject();
  },
  findByEmail: async (email: string) => {
    const user = await User.findOne({ email });
    if (!user)
      return null;
    return user.toObject();
  },
  findByUsernameOrEmail: async (identifier: string) => {
    const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
    if (!user)
      return null;
    return user.toObject();
  },
};

export default UserRepositories;
