import express from "express";
import getUserFromToken from "#middleware/getUserFromToken";
import usersRouter from "./routes/users.js";

const app = express();

app.use(express.json());
app.use(getUserFromToken);

app.use("/users", usersRouter);

export default app;
