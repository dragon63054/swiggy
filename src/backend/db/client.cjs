const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "swiggy",
  password: process.env.DB_PASSWORD,
  port: 5432,
});
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false, // Render requires SSL
//   },
// });
pool.connect()
  .then(async () => {
    console.log("✅ Connected to PostgreSQL");

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(200) UNIQUE NOT NULL,
        password VARCHAR(200) NOT NULL,
        role VARCHAR(20) NOT NULL,
        token VARCHAR(200)
      );
    `);

    // Menu items for users (admin)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        description TEXT,
        price DECIMAL,
        image_url TEXT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Restaurants
    await pool.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id SERIAL PRIMARY KEY,
        restaurant_name VARCHAR(100) NOT NULL,
        url TEXT,
        timing VARCHAR(100),
        address TEXT,
        location VARCHAR(100),
        city VARCHAR(100),
        offer TEXT,
        contact_number VARCHAR(20),
        restaurant_type VARCHAR(50),
        ratings_for_swiggy DECIMAL
      );
    `);

    // Restaurant menu items
    await pool.query(`
      CREATE TABLE IF NOT EXISTS restaurant_menu_items (
        id SERIAL PRIMARY KEY,
        restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
        item_name VARCHAR(100),
        image_url TEXT,
        description TEXT,
        price DECIMAL,
        rating DECIMAL
      );
    `);

    console.log("✅ All tables are ready");
  })
  .catch((err) => console.error("❌ PostgreSQL connection error:", err));


module.exports = pool;

