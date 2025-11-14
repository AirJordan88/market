import { Router } from "express";
import { getAllProducts, getProductById } from "#db/queries/products.js";

import db from "#db/client";
import { getOrdersByProduct } from "#db/queries/orders.js";

const router = Router();

/************************************************
 * GET /products
 * Returns all products
 ************************************************/
router.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (err) {
    next(err);
  }
});

/************************************************
 * GET /products/:id
 * Returns a single product by id
 ************************************************/
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).send({ error: "Invalid product id" });
    }

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    res.send(product);
  } catch (err) {
    next(err);
  }
});

/************************************************
 * ⭐ GET /products/:id/orders
 * Must be logged in
 * Must check product exists AFTER auth
 * Returns all orders by this user containing this product
 ************************************************/
router.get("/:id/orders", async (req, res, next) => {
  try {
    // 1. Must be logged in
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const productId = req.params.id;

    // 2. Check product exists
    const productCheck = await db.query(
      "SELECT id FROM products WHERE id = $1",
      [productId]
    );

    if (productCheck.rowCount === 0) {
      return res.status(404).send("Product not found");
    }

    // 3. Get orders for this user that include this product
    const orders = await getOrdersByProduct(productId, req.user.id);

    return res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
});

export default router;
