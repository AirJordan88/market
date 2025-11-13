import { Router } from "express";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

// DB
import {
  createOrder,
  getOrdersByUser,
  getOrderById,
  addProductToOrder,
  getOrderProducts,
  getOrdersByProduct,
} from "#db/queries/orders";

const router = Router();

/**
 * POST /orders
 * - requires user
 * - requires { date }
 */
router.post("/", requireUser, requireBody(["date"]), async (req, res, next) => {
  try {
    const order = await createOrder(req.user.id, req.body.date);
    res.status(201).send(order);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /orders
 * - requires user
 */
router.get("/", requireUser, async (req, res, next) => {
  try {
    const orders = await getOrdersByUser(req.user.id);
    res.send(orders);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /orders/:id
 * - requires user
 * - 404 if missing
 * - 403 if belongs to another user
 */
router.get("/:id", requireUser, async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).send("Order not found");

    if (order.user_id !== req.user.id) return res.status(403).send("Forbidden");

    res.send(order);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /orders/:id/products
 * - requires user
 * - requires { productId, quantity }
 */
router.post(
  "/:id/products",
  requireUser,
  requireBody(["productId", "quantity"]),
  async (req, res, next) => {
    try {
      const order = await getOrderById(req.params.id);
      if (!order) return res.status(404).send("Order not found");
      if (order.user_id !== req.user.id)
        return res.status(403).send("Forbidden");

      const added = await addProductToOrder(
        req.params.id,
        req.body.productId,
        req.body.quantity
      );

      res.status(201).send(added);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /orders/:id/products
 */
router.get("/:id/products", requireUser, async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).send("Order not found");
    if (order.user_id !== req.user.id) return res.status(403).send("Forbidden");

    const products = await getOrderProducts(req.params.id);
    res.send(products);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /products/:id/orders
 */
router.get("/products/:id/orders", requireUser, async (req, res, next) => {
  try {
    const orders = await getOrdersByProduct(req.params.id);
    res.send(orders);
  } catch (err) {
    next(err);
  }
});

export default router;
