// const express = require('express');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { Client } = require('pg');
// const dotenv = require('dotenv');
// const your_jwt_secret = "57a850562461ff9c5cf2275789bf5972e1028cc482cc2769251e32d701120f78"
// dotenv.config();

// const app = express();
// const port = 3001;

// // PostgreSQL client setup
// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'swiggy',
//   password: 'password', // ⚠️ Replace with your real password or use process.env
//   port: 5432,
// });

// // Connect and create tables
// client.connect()
//   .then(async () => {
//     console.log('Connected to PostgreSQL');

//     await client.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(200) NOT NULL,
//         email VARCHAR(200) UNIQUE NOT NULL,
//         password VARCHAR(200) NOT NULL,
//         role VARCHAR(20) NOT NULL
//       );
//     `);

//     await client.query(`
//       CREATE TABLE IF NOT EXISTS menu_items (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(100),
//         description TEXT,
//         price DECIMAL,
//         image_url TEXT,
//         user_id INTEGER REFERENCES users(id)
//       );
//     `);

//     console.log("Tables are ready");
//   })
//   .catch(err => console.error("PostgreSQL connection error:", err));

// // Middleware
// app.use(cors());
// app.use(express.json());

// // ========== Authentication ==========

// // Register
// app.post('/register', async (req, res) => {
//   const { name, email, password, role } = req.body;

//   try {
//     const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (existingUser.rows.length > 0) {
//       return res.status(400).json({ error: 'Email already registered' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const result = await client.query(
//       'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
//       [name, email, hashedPassword, role]
//     );

//     const token = jwt.sign({ id: result.rows[0].id, role: result.rows[0].role }, 'your_jwt_secret', { expiresIn: '1h' });

//     res.status(201).json({ user: result.rows[0], token });

//   } catch (err) {
//     console.error("Registration error:", err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Login
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (user.rows.length === 0) {
//       return res.status(400).json({ error: 'Email not registered' });
//     }

//     const isMatch = await bcrypt.compare(password, user.rows[0].password);
//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid password' });
//     }

//     const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, 'your_jwt_secret', { expiresIn: '1h' });

//     res.status(200).json({
//       user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role },
//       token
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // ========== Restaurant Data (in-memory) ==========
// const restaurants = [];

// app.get("/restaurant", (req, res) => res.send(restaurants));

// app.post("/restaurant", (req, res) => {
//   const newRestaurants = req.body;

//   if (!Array.isArray(newRestaurants)) {
//     return res.status(400).json({ error: "Expected an array of restaurants" });
//   }

//   restaurants.push(...newRestaurants);
//   res.status(201).json({
//     message: `${newRestaurants.length} restaurants added`,
//     restaurants: newRestaurants
//   });
// });

// // ========== JWT Middleware ==========

// const verifyUser = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).json({ error: 'Token missing' });

//   try {
//     const decoded = jwt.verify(token, 'your_jwt_secret');
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(400).json({ error: 'Invalid token' });
//   }
// };

// const verifyAdmin = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).json({ error: 'Access denied, token missing' });

//   try {
//     const decoded = jwt.verify(token, 'your_jwt_secret');
//     if (decoded.role !== 'admin') {
//       return res.status(403).json({ error: 'Access denied' });
//     }
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(400).json({ error: 'Invalid token' });
//   }
// };

// // ========== Menu CRUD ==========

// // Get all menu items for current user
// // app.get("/menu", verifyUser, async (req, res) => {
// //   try {
// //     const result = await client.query("SELECT * FROM menu_items WHERE user_id = $1", [req.user.id]);
// //     res.json(result.rows);
// //   } catch {
// //     res.status(500).json({ error: "Server error" });
// //   }
// // });

// app.get("/menu", verifyUser, async (req, res) => {
//   try {
//     const result = await client.query("SELECT * FROM menu_items WHERE user_id = $1", [req.user.id]);
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error fetching menu items:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });


// // Add menu item (only by authenticated user)
// app.post("/menu", verifyUser, async (req, res) => {
//   const { name, description, price, image_url } = req.body;

//   try {
//     const result = await client.query(
//       "INSERT INTO menu_items (name, description, price, image_url, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
//       [name, description, price, image_url, req.user.id]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error("Add menu error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Edit menu item (only by owner)
// app.put("/menu/:id", verifyUser, async (req, res) => {
//   const { id } = req.params;
//   const { name, description, price, image_url } = req.body;

//   try {
//     const result = await client.query(
//       "UPDATE menu_items SET name=$1, description=$2, price=$3, image_url=$4 WHERE id=$5 AND user_id=$6 RETURNING *",
//       [name, description, price, image_url, id, req.user.id]
//     );

//     if (result.rows.length === 0) return res.status(403).json({ error: "Not allowed" });
//     res.json(result.rows[0]);
//   } catch {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Delete menu item (only by owner)
// app.delete("/menu/:id", verifyUser, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await client.query(
//       "DELETE FROM menu_items WHERE id=$1 AND user_id=$2 RETURNING *",
//       [id, req.user.id]
//     );

//     if (result.rows.length === 0) return res.status(403).json({ error: "Not allowed" });
//     res.json({ message: "Deleted", item: result.rows[0] });
//   } catch {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ========== Start Server ==========
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });


// const express = require('express');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { Client } = require('pg');
// const dotenv = require('dotenv');
// const your_jwt_secret = "57a850562461ff9c5cf2275789bf5972e1028cc482cc2769251e32d701120f78"
// dotenv.config();

// const app = express();
// const port = 3001;

// // PostgreSQL client setup
// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'swiggy',
//   password: 'password', // ⚠️ Replace with your real password or use process.env
//   port: 5432,
// });

// // Connect and create tables
// client.connect()
//   .then(async () => {
//     console.log('Connected to PostgreSQL');

//     await client.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(200) NOT NULL,
//         email VARCHAR(200) UNIQUE NOT NULL,
//         password VARCHAR(200) NOT NULL,
//         role VARCHAR(20) NOT NULL,
//         token VARCHAR(200)
//       );
//     `);

//     await client.query(`
//       CREATE TABLE IF NOT EXISTS menu_items (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(100),
//         description TEXT,
//         price DECIMAL,
//         image_url TEXT,
//         user_id INTEGER REFERENCES users(id)
//       );
//     `);

//     console.log("Tables are ready");
//   })
//   .catch(err => console.error("PostgreSQL connection error:", err));

// // Middleware
// app.use(cors());
// app.use(express.json());

// // ========== Authentication ==========

// // Register
// app.post('/register', async (req, res) => {
//   const { name, email, password, role } = req.body;

//   try {
//     const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (existingUser.rows.length > 0) {
//       return res.status(400).json({ error: 'Email already registered' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const result = await client.query(
//       'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
//       [name, email, hashedPassword, role]
//     );

//     const token = jwt.sign({ id: result.rows[0].id, role: result.rows[0].role }, your_jwt_secret, { expiresIn: '1h' });

//     res.status(201).json({ user: result.rows[0], token });

//   } catch (err) {
//     console.error("Registration error:", err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Login
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (user.rows.length === 0) {
//       return res.status(400).json({ error: 'Email not registered' });
//     }

//     const isMatch = await bcrypt.compare(password, user.rows[0].password);
//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid password' });
//     }

//     const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, your_jwt_secret, { expiresIn: '1h' });

//     res.status(200).json({
//       user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role },
//       token
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // ========== Restaurant Data (in-memory) ==========
// const restaurants = [];

// app.get("/restaurant", (req, res) => res.send(restaurants));

// app.post("/restaurant", (req, res) => {
//   const newRestaurants = req.body;

//   if (!Array.isArray(newRestaurants)) {
//     return res.status(400).json({ error: "Expected an array of restaurants" });
//   }

//   restaurants.push(...newRestaurants);
//   res.status(201).json({
//     message: `${newRestaurants.length} restaurants added`,
//     restaurants: newRestaurants
//   });
// });

// // ========== JWT Middleware ==========

// const verifyUser = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).json({ error: 'Token missing' });

//   try {
//     const decoded = jwt.verify(token, your_jwt_secret);
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(400).json({ error: 'Invalid token' });
//   }
// };

// const verifyAdmin = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).json({ error: 'Access denied, token missing' });

//   try {
//     const decoded = jwt.verify(token, your_jwt_secret);
//     if (decoded.role !== 'admin') {
//       return res.status(403).json({ error: 'Access denied' });
//     }
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(400).json({ error: 'Invalid token' });
//   }
// };

// // ========== Menu CRUD ==========

// // Get all menu items for current user
// // app.get("/menu", verifyUser, async (req, res) => {
// //   try {
// //     const result = await client.query("SELECT * FROM menu_items WHERE user_id = $1", [req.user.id]);
// //     res.json(result.rows);
// //   } catch {
// //     res.status(500).json({ error: "Server error" });
// //   }
// // });

// app.get("/menu", verifyUser, async (req, res) => {
//   try {
//     const result = await client.query("SELECT * FROM restaurant_menu_items WHERE user_id = $1", [req.user.id]);
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error fetching menu items:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });


// // Add menu item (only by authenticated user)
// app.post("/menu", verifyUser, async (req, res) => {
//   const { name, description, price, image_url } = req.body;

//   try {
//     const result = await client.query(
//       "INSERT INTO menu_items (name, description, price, image_url, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
//       [name, description, price, image_url, req.user.id]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error("Add menu error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Edit menu item (only by owner)
// app.put("/menu/:id", verifyUser, async (req, res) => {
//   const { id } = req.params;
//   const { name, description, price, image_url } = req.body;

//   try {
//     const result = await client.query(
//       "UPDATE menu_items SET name=$1, description=$2, price=$3, image_url=$4 WHERE id=$5 AND user_id=$6 RETURNING *",
//       [name, description, price, image_url, id, req.user.id]
//     );

//     if (result.rows.length === 0) return res.status(403).json({ error: "Not allowed" });
//     res.json(result.rows[0]);
//   } catch {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Delete menu item (only by owner)
// app.delete("/menu/:id", verifyUser, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await client.query(
//       "DELETE FROM menu_items WHERE id=$1 AND user_id=$2 RETURNING *",
//       [id, req.user.id]
//     );

//     if (result.rows.length === 0) return res.status(403).json({ error: "Not allowed" });
//     res.json({ message: "Deleted", item: result.rows[0] });
//   } catch {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ========== Start Server ==========
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });


// const express = require('express');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { Client } = require('pg');
// const dotenv = require('dotenv');
// dotenv.config();

// const your_jwt_secret = "57a850562461ff9c5cf2275789bf5972e1028cc482cc2769251e32d701120f78";

// const app = express();
// const port = 3001;

// // PostgreSQL client setup
// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'swiggy',
//   password: 'password', // ⚠️ Replace with your real password or use process.env
//   port: 5432,
// });

// // Connect and create tables
// client.connect()
//   .then(async () => {
//     console.log('Connected to PostgreSQL');

//     await client.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(200) NOT NULL,
//         email VARCHAR(200) UNIQUE NOT NULL,
//         password VARCHAR(200) NOT NULL,
//         role VARCHAR(20) NOT NULL,
//         token VARCHAR(200)
//       );
//     `);

//     await client.query(`
//       CREATE TABLE IF NOT EXISTS restaurant_menu_items (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(100),
//         description TEXT,
//         price DECIMAL,
//         image_url TEXT,
//         user_id INTEGER REFERENCES users(id)
//       );
//     `);

//     await client.query(`
//       CREATE TABLE IF NOT EXISTS restaurant (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(200),
//         location TEXT,
//         type VARCHAR(100)
//       );
//     `);

//     console.log("Tables are ready");
//   })
//   .catch(err => console.error("PostgreSQL connection error:", err));

// // Middleware
// app.use(cors());
// app.use(express.json());

// // ========== Authentication ==========

// // Register
// app.post('/register', async (req, res) => {
//   const { name, email, password, role } = req.body;

//   try {
//     const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (existingUser.rows.length > 0) {
//       return res.status(400).json({ error: 'Email already registered' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const result = await client.query(
//       'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
//       [name, email, hashedPassword, role]
//     );

//     const token = jwt.sign({ id: result.rows[0].id, role: result.rows[0].role }, your_jwt_secret, { expiresIn: '1h' });

//     res.status(201).json({ user: result.rows[0], token });

//   } catch (err) {
//     console.error("Registration error:", err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Login
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (user.rows.length === 0) {
//       return res.status(400).json({ error: 'Email not registered' });
//     }

//     const isMatch = await bcrypt.compare(password, user.rows[0].password);
//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid password' });
//     }

//     const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, your_jwt_secret, { expiresIn: '1h' });

//     res.status(200).json({
//       user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role },
//       token
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // ========== JWT Middleware ==========

// const verifyUser = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).json({ error: 'Token missing' });

//   try {
//     const decoded = jwt.verify(token, your_jwt_secret);
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(400).json({ error: 'Invalid token' });
//   }
// };

// const verifyAdmin = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).json({ error: 'Access denied, token missing' });

//   try {
//     const decoded = jwt.verify(token, your_jwt_secret);
//     if (decoded.role !== 'admin') {
//       return res.status(403).json({ error: 'Access denied' });
//     }
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(400).json({ error: 'Invalid token' });
//   }
// };

// // ========== Menu CRUD ==========

// // Get all menu items for current user
// app.get("/menu", verifyUser, async (req, res) => {
//   try {
//     const result = await client.query("SELECT * FROM restaurant_menu_items WHERE user_id = $1", [req.user.id]);
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error fetching menu items:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Add menu item (only by authenticated user)
// app.post("/menu", verifyUser, async (req, res) => {
//   const { name, description, price, image_url } = req.body;

//   try {
//     const result = await client.query(
//       "INSERT INTO restaurant_menu_items (name, description, price, image_url, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
//       [name, description, price, image_url, req.user.id]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error("Add menu error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Edit menu item (only by owner)
// app.put("/menu/:id", verifyUser, async (req, res) => {
//   const { id } = req.params;
//   const { name, description, price, image_url } = req.body;

//   try {
//     const result = await client.query(
//       "UPDATE restaurant_menu_items SET name=$1, description=$2, price=$3, image_url=$4 WHERE id=$5 AND user_id=$6 RETURNING *",
//       [name, description, price, image_url, id, req.user.id]
//     );

//     if (result.rows.length === 0) return res.status(403).json({ error: "Not allowed" });
//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Delete menu item (only by owner)
// app.delete("/menu/:id", verifyUser, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await client.query(
//       "DELETE FROM restaurant_menu_items WHERE id=$1 AND user_id=$2 RETURNING *",
//       [id, req.user.id]
//     );

//     if (result.rows.length === 0) return res.status(403).json({ error: "Not allowed" });
//     res.json({ message: "Deleted", item: result.rows[0] });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ========== Start Server ==========
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });



const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes.cjs');
const menuRoutes = require('./routes/menuRoutes.cjs');
const restaurantRoutes = require('./routes/restaurantRoutes.cjs');


const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use("/restaurant", restaurantRoutes); 
app.use('/restaurant', menuRoutes);

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});

