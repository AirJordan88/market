import { Router } from "express";
import requireUser from "#middleware/requireUser";
import { getOrdersByUserId, createOrder } from "#db/queries/orders.js";

const router = Router();

/**
 * GET /orders
 * returns all orders for the logged-in user
 */
router.get("/", requireUser, async (req, res) => {
  const orders = await getOrdersByUserId(req.user.id);
  res.send(orders);
});

/**
 * POST /orders
 * creates a new order for the logged-in user
 */
router.post("/", requireUser, async (req, res) => {
  const order = await createOrder(req.user.id);
  res.status(201).send(order);
});

export default router;
