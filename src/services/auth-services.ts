import type { JwtPayload } from "jsonwebtoken";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import type { UserFields } from "../types/index.js";

import { ENV } from "../env.js";
import UserRepositories from "../repositories/user-repositories.js";

const AuthService = {
  generateToken: (userId: string) => {
    return jwt.sign({ id: userId }, ENV.SECRET_KEY, {
      expiresIn: "7d",
    });
  },
  decodeToken: (token: string) => {
    const decodeToken = jwt.verify(token, ENV.SECRET_KEY) as JwtPayload;
    return { id: decodeToken.id as string, exp: decodeToken.exp };
  },
  getCurrentUser: async (token: string) => {
    const { id, exp } = AuthService.decodeToken(token);
    if (!id || !exp) {
      throw new Error("Invalid Token!");
    }

    const expDate = new Date(exp * 1000);

    const now = new Date();

    if (expDate < now) {
      throw new Error("Token are expired!");
    }
    const user = await UserRepositories.findById(id);
    if (!user)
      throw new Error("invalid token");
    const { password, ...rest } = user;
    return rest;
  },
  checkCredentials: async ({ identifier, password }: Partial<UserFields & { identifier: string }>) => {
    if (!identifier || !identifier.trim().length || !password || !password.trim().length) {
      throw new Error(`Please Provide the required credentials.`);
    }
    const findUser = await UserRepositories.findByUsernameOrEmail(identifier);
    if (!findUser) {
      throw new Error(`User Not found!`);
    }
    if (!findUser.password) {
      throw new Error(`It seems like you registered using Google, please login with Google`);
    }
    const validatedPassword = bcrypt.compareSync(password, findUser.password);
    if (!validatedPassword) {
      throw new Error(`Invalid Password!`);
    }
    const { password: pass, ...allUserInformationWithoutPassword } = findUser;
    return allUserInformationWithoutPassword;
  },
};

export default AuthService;
