import type { Request, Response } from "express";

import emailValidator from "email-validator";

import type { UserFields } from "../types/index.js";

import UserRepositories from "../repositories/user-repositories.js";
import AuthService from "../services/auth-services.js";
import UserServices from "../services/user-services.js";

const AuthController = {
  getCurrentUser: async (req: Request, res: Response) => {
    try {
      res.status(200).json({ error: false, message: "Successfully Current User" });
    }
    catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      res.status(400).json({ error: true, message: (err as Error).message || "Something went wrong!" });
    }
  },
  signUp: async (req: Request, res: Response) => {
    try {
      const { username, email, password } = await req.body as UserFields;
      if (!username && !password && !email) {
        throw new Error("Needs all required fields!");
      }
      if (!username.trim().length) {
        throw new Error("Username are required!");
      }
      const usernameRegex = /[^\\w-]/;

      if (!usernameRegex.test(username)) {
        throw new Error("Username cannot using special character except _ and -");
      }

      if (!email.trim().length) {
        throw new Error("Email are required!");
      }

      if (!emailValidator.validate(email)) {
        throw new Error("Invalid email address!");
      }

      if (!password || password.trim().length < 6) {
        throw new Error("Password must be at least 6 characters or more!");
      }
      const usedUsername = await UserRepositories.findByUsername(username);

      if (usedUsername) {
        throw new Error("Username is already in use!");
      }
      const existingEmail = await UserRepositories.findByEmail(email);
      if (existingEmail) {
        throw new Error("Email is already in use!");
      }

      const user = await UserServices.create({
        username,
        email,
        password,
      });
      const token = AuthService.generateToken(user._id.toString());
      res.status(200).json({
        error: false,
        data: { user, token },
        message: "Successfully SignUp User",
      });
    }
    catch
    (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      res.status(400).json({ error: true, message: (err as Error).message || "Something went wrong!" });
    }
  },
  signIn: async (req: Request, res: Response) => {
    try {
      const { identifier, password } = req.body as UserFields & { identifier: string };
      const user = await AuthService.checkCredentials({ identifier, password });
      const token = AuthService.generateToken(user._id.toString());
      res.status(200).json({ error: false, data: { user, token }, message: "Successfully SignIn User" });
    }
    catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      res.status(400).json({ error: true, message: (err as Error).message || "Something went wrong!" });
    }
  },
};

export default AuthController;
