import express from "express";
import connection from "../db/db.ts";
import type { User } from "../db/types.ts";
import { compare } from "../lib/utils.ts";
import jwt from "jsonwebtoken";
import type { AuthPayload } from "./types.ts";

const authRoutes = express.Router();

authRoutes.post("/login", async (req, res) => {
  const { username, password }: { username: string; password: string } =
    req.body;
  try {
    const [users] = await connection.execute<User[]>(
      `
      SELECT *
      FROM users
      WHERE username = ?
      `,
      [username]
    );

    const user = users[0];
    const isMatched = await compare(password, user.password);

    console.log(isMatched);

    if (!user.username || isMatched === false) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const authPayload: AuthPayload = {
      id: user.id,
      username: user.username,
    };

    const token = jwt.sign(authPayload, "jwt-secret", { expiresIn: "7 days" });
    console.log(token);

    return res.status(200).json(token);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Database error" });
  }
});

authRoutes.delete("/logout", async (req, res) => {
  try {
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Database error" });
  }
});

export default authRoutes;
