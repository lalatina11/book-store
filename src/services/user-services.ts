import { hashSync } from "bcrypt-ts";

import type { UserFields } from "../types/index.js";

import UserRepositories from "../repositories/user-repositories.js";

const UserServices = {
  create: async (fields: UserFields) => {
    const { username, email, password: passwordFromInput } = fields;
    if (!passwordFromInput) {
      throw new Error("Password is required!");
    }
    const regexPassword = /^(?=.*\d)(?=.*[!@#$%^&*])/;
    if (!regexPassword.test(passwordFromInput)) {
      throw new Error("Password must have at least one number and one special character!");
    }
    const password = hashSync(passwordFromInput, 10);
    const avatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${username}`;
    const { password: pass, ...allUserInformationWithoutPassword } = await UserRepositories.create({
      username,
      email,
      password,
      avatar,
    });
    return allUserInformationWithoutPassword;
  },
  findUserByUsername: async (username: string) => {
    const user = await UserRepositories.findByUsername(username);
    if (!user)
      return null;
    const { password, ...allUserInformationWithoutPassword } = user;
    return allUserInformationWithoutPassword;
  },
  findUserByEmail: async (email: string) => {
    const user = await UserRepositories.findByEmail(email);
    if (!user)
      return null;
    const { password, ...allUserInformationWithoutPassword } = user;
    return allUserInformationWithoutPassword;
  },
  findByUsernameOrEmail: async (identifier: string) => {
    const user = await UserRepositories.findByUsernameOrEmail(identifier);
    if (!user)
      return null;
    const { password, ...allUserInformationWithoutPassword } = user;
    return allUserInformationWithoutPassword;
  },
};

export default UserServices;
