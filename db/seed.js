import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // Clear tables
  await db.query(`DELETE FROM orders_products;`);
  await db.query(`DELETE FROM orders;`);
  await db.query(`DELETE FROM products;`);
  await db.query(`DELETE FROM users;`);

  // Seed user
  const {
    rows: [user],
  } = await db.query(
    `
      INSERT INTO users (username, password)
      VALUES ('leon_kennedy', 'password123')
      RETURNING id;
    `
  );

  // Seed products
  const products = await db.query(`
    INSERT INTO products (title, description, price) VALUES
      ('Handgun Ammo', 'Box of 9mm rounds used by standard handguns. Essential for survival.', 1.99),
      ('First Aid Spray', 'Powerful medical spray that completely restores health.', 9.99),
      ('Green Herb', 'A medicinal herb that restores a small amount of health.', 4.99),
      ('Red Herb', 'Can be mixed with a green herb to boost its potency.', 5.99),
      ('Shotgun Shells', 'Ammunition for shotguns. Devastating at close range.', 3.49),
      ('TMP', 'Fully automatic submachine gun.', 29900.00),
      ('Rifle', 'High-powered bolt-action rifle.', 35000.00),
      ('Rocket Launcher', 'Massive damage weapon.', 300000.00),
      ('Attaché Case L', 'Large carrying case.', 98000.00),
      ('Treasure Map', 'Reveals hidden treasures.', 10000.00)
    RETURNING id;
  `);

  // Create an order
  const {
    rows: [order],
  } = await db.query(
    `
      INSERT INTO orders (date, note, user_id)
      VALUES (CURRENT_DATE, 'Merchant special deal order', $1)
      RETURNING id;
    `,
    [user.id]
  );

  // Add 5+ distinct products
  const productIds = products.rows.map((p) => p.id);

  await db.query(
    `
      INSERT INTO orders_products (order_id, product_id, quantity) VALUES
      (${order.id}, ${productIds[0]}, 3),
      (${order.id}, ${productIds[1]}, 1),
      (${order.id}, ${productIds[2]}, 2),
      (${order.id}, ${productIds[3]}, 1),
      (${order.id}, ${productIds[4]}, 1),
      (${order.id}, ${productIds[9]}, 1);
    `
  );
}
