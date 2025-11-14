import { Router } from "express";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import db from "#db/client";

import {
  createOrder,
  getOrdersByUser,
  getOrderById,
  addProductToOrder,
  getOrderProducts,
  getOrdersByProduct,
} from "#db/queries/orders.js";

const router = Router();

/************************************************
 * FIRST: /products/:id/orders
 ************************************************/
router.get("/products/:id/orders", async (req, res, next) => {
  try {
    // 1. Must check auth FIRST based on tests
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const productId = req.params.id;

    // 2. Check product existence AFTER auth
    const productCheck = await db.query(
      "SELECT id FROM products WHERE id = $1",
      [productId]
    );

    if (productCheck.rowCount === 0) {
      return res.status(404).send("Product not found");
    }

    // 3. Get all orders by this user that contain the product
    const orders = await getOrdersByProduct(productId, req.user.id);

    return res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
});

/************************************************
 * THEN: All /orders routes
 ************************************************/

router.post("/", requireUser, requireBody(["date"]), async (req, res, next) => {
  try {
    const order = await createOrder(req.user.id, req.body.date);
    res.status(201).send(order);
  } catch (err) {
    next(err);
  }
});

router.get("/", requireUser, async (req, res, next) => {
  try {
    const orders = await getOrdersByUser(req.user.id);
    res.send(orders);
  } catch (err) {
    next(err);
  }
});

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

router.post(
  "/:id/products",
  requireUser,
  requireBody(["productId", "quantity"]),
  async (req, res, next) => {
    try {
      const order = await getOrderById(req.params.id);
      if (!order) return res.status(404).send("Order not found");
      if (order.user_id !== req.user.id) {
        return res.status(403).send("Forbidden");
      }

      const productCheck = await db.query(
        "SELECT id FROM products WHERE id = $1",
        [req.body.productId]
      );
      if (productCheck.rowCount === 0) {
        return res.status(400).send("Product does not exist");
      }

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

export default router;
