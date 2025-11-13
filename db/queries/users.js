import db from "../client.js";
import bcrypt from "bcrypt";

// Create a user
export async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const {
    rows: [user],
  } = await db.query(
    `
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING id, username, password;
    `,
    [username, hashedPassword]
  );

  return user;
}

// Find by username
export async function getUserByUsername(username) {
  const {
    rows: [user],
  } = await db.query(
    `
      SELECT * FROM users
      WHERE username = $1;
    `,
    [username]
  );

  return user;
}

// Find by id (used in getUserFromToken)
export async function getUserById(id) {
  const {
    rows: [user],
  } = await db.query(
    `
      SELECT id, username
      FROM users
      WHERE id = $1;
    `,
    [id]
  );

  return user;
}
