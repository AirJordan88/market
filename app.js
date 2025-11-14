import express from "express";

import getUserFromToken from "#middleware/getUserFromToken";

import usersRouter from "./routes/users.js";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";

const app = express();

app.use(express.json());

/************************************************
 * ⭐ IMPORTANT:
 * Attach req.user BEFORE routers run.
 ************************************************/
app.use(getUserFromToken);

/************************************************
 * ROUTES
 ************************************************/
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

/************************************************
 * ERROR HANDLER
 ************************************************/
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message || "Server error");
});

export default app;
