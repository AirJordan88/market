import { getUserById } from "#db/queries/users";
import { verifyToken } from "#utils/jwt";

/** Attaches req.user if a valid JWT is provided */
export default async function getUserFromToken(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(); // no user, but don't block
  }

  const token = authHeader.slice(7);

  try {
    const { id } = verifyToken(token);
    const user = await getUserById(id);

    if (!user) {
      return res.status(401).send("Invalid token");
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
}
