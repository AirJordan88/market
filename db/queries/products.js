import db from "#db/client.js";

/** Return all products */
export async function getAllProducts() {
  const { rows } = await db.query(`SELECT * FROM products ORDER BY id`);
  return rows;
}

/** Return a single product by id */
export async function getProductById(id) {
  const { rows } = await db.query(`SELECT * FROM products WHERE id = $1`, [id]);
  return rows[0];
}
