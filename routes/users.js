import { Router } from "express";
import { createUser, getUserByUsername } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";
import bcrypt from "bcrypt";

const router = Router();

/*
  POST /users/register
*/
router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const existingUser = await getUserByUsername(username);
      if (existingUser) {
        return res.status(400).send("Username already taken.");
      }

      const user = await createUser({ username, password });
      const token = createToken({ id: user.id, username: user.username });

      res.status(201).send(token);
    } catch (err) {
      next(err);
    }
  }
);

/*
  POST /users/login
*/
router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const user = await getUserByUsername(username);
      if (!user) return res.status(401).send("Invalid credentials");

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(401).send("Invalid credentials");

      const token = createToken({ id: user.id, username: user.username });

      res.send(token);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
