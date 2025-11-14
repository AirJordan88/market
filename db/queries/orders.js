import db from "#db/client";

/** CREATE a new order */
export async function createOrder(userId, date) {
  const result = await db.query(
    `
    INSERT INTO orders (user_id, date)
    VALUES ($1, $2)
    RETURNING *;
    `,
    [userId, date]
  );
  return result.rows[0];
}

/** GET all orders for a user */
export async function getOrdersByUser(userId) {
  const result = await db.query(
    `
    SELECT * FROM orders
    WHERE user_id = $1
    ORDER BY id;
    `,
    [userId]
  );
  return result.rows;
}

/** GET order by ID */
export async function getOrderById(orderId) {
  const result = await db.query(
    `
    SELECT * FROM orders
    WHERE id = $1;
    `,
    [orderId]
  );
  return result.rows[0];
}

/** ADD item to an order */
export async function addProductToOrder(orderId, productId, quantity) {
  const result = await db.query(
    `
    INSERT INTO orders_products (order_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (order_id, product_id)
    DO UPDATE SET quantity = orders_products.quantity + EXCLUDED.quantity
    RETURNING *;
    `,
    [orderId, productId, quantity]
  );
  return result.rows[0];
}

/** GET all products in an order */
export async function getOrderProducts(orderId) {
  const result = await db.query(
    `
    SELECT p.*, op.quantity
    FROM products p
    JOIN orders_products op ON p.id = op.product_id
    WHERE op.order_id = $1;
    `,
    [orderId]
  );
  return result.rows;
}

/** GET all orders BY PRODUCT for a specific user */
export async function getOrdersByProduct(productId, userId) {
  const result = await db.query(
    `
    SELECT o.*
    FROM orders o
    JOIN orders_products op ON o.id = op.order_id
    WHERE op.product_id = $1
      AND o.user_id = $2
    ORDER BY o.id;
    `,
    [productId, userId]
  );
  return result.rows;
}
