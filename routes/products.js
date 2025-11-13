import { Router } from "express";
import { getAllProducts, getProductById } from "#db/queries/products.js";

const router = Router();

/**
 * GET /products
 * Returns all products
 */
router.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /products/:id
 * Returns a single product by id
 */
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

export default router;
