const express = require('express');
const pool = require('../db/client.cjs');
const { verifyUser } = require('../middleware/auth.cjs');

const router = express.Router();

// Get all restaurants
// GET /restaurant/restaurant-menu
// router.get("/restaurant-menu", async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT m.id, m.item_name, m.description, m.price, m.image_url, m.rating, m.offer,
//              r.restaurant_name, r.restaurant_type, r.timing, r.contact_number, r.description AS restaurant_description
//       FROM restaurant_menu_items m
//       JOIN restaurants r ON m.restaurant_id = r.id
//     `);
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error fetching joined menu:", err);
//     res.status(500).json({ error: "Failed to fetch restaurant menu" });
//   }
// });
// ✅ Add this to your Express server code
router.get("/restaurant-menu", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM restaurant_menu_items");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching restaurant menu:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// Get menu by restaurant ID
router.get("/restaurant-menu-items/:restaurant_id", async (req, res) => {
  const { restaurant_id } = req.params;
  try {
    const result = await pool.query(`
      SELECT * FROM restaurant_menu_items WHERE restaurant_id = $1
    `, [restaurant_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No menu items found" });
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});

// Add a new menu item
router.post("/restaurant-menu-items", verifyUser, async (req, res) => {
  const { restaurant_id, item_name, description, price, image_url, rating } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO restaurant_menu_items (restaurant_id, item_name, description, price, image_url, rating)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [restaurant_id, item_name, description, price, image_url, rating]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add menu item" });
  }
});

// Update menu item
router.put("/restaurant-menu-items/:id", verifyUser, async (req, res) => {
  const { id } = req.params;
  const { item_name, description, price, image_url, rating } = req.body;

  try {
    const result = await pool.query(`
      UPDATE restaurant_menu_items
      SET item_name = $1, description = $2, price = $3, image_url = $4, rating = $5
      WHERE id = $6
      RETURNING *
    `, [item_name, description, price, image_url, rating, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

// Delete menu item
router.delete("/restaurant-menu-items/:id", verifyUser, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM restaurant_menu_items WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted", item: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

module.exports = router;

// const express = require('express');
// const pool = require('../db/client.cjs');
// const { verifyUser } = require('../middleware/auth.cjs');

// const router = express.Router();

// // ✅ Get all restaurant menu items
// router.get("/restaurant-menu", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM restaurant_menu_items");
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error fetching restaurant menu:", err);
//     res.status(500).json({ error: "Failed to fetch restaurant menu items" });
//   }
// });

// // ✅ Get menu items by restaurant ID
// router.get("/restaurant-menu-items/:restaurant_id", async (req, res) => {
//   const { restaurant_id } = req.params;
//   try {
//     const result = await pool.query(
//       "SELECT * FROM restaurant_menu_items WHERE restaurant_id = $1",
//       [restaurant_id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "No menu items found" });
//     }

//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error fetching menu by restaurant ID:", err);
//     res.status(500).json({ error: "Failed to fetch menu" });
//   }
// });

// // ✅ Add a new menu item (admin only)
// router.post("/restaurant-menu-items", verifyUser, async (req, res) => {
//   const { restaurant_id, item_name, description, price, image_url, rating, offer, offer_price } = req.body;

//   try {
//     const result = await pool.query(
//       `INSERT INTO restaurant_menu_items 
//         (restaurant_id, item_name, description, price, image_url, rating, offer, offer_price)
//        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//        RETURNING *`,
//       [restaurant_id, item_name, description, price, image_url, rating, offer, offer_price]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error("Error adding menu item:", err);
//     res.status(500).json({ error: "Failed to add menu item" });
//   }
// });

// // ✅ Update a menu item (admin only)
// router.put("/restaurant-menu-items/:id", verifyUser, async (req, res) => {
//   const { id } = req.params;
//   const { item_name, description, price, image_url, rating, offer, offer_price } = req.body;

//   try {
//     const result = await pool.query(
//       `UPDATE restaurant_menu_items
//        SET item_name = $1, description = $2, price = $3, image_url = $4, rating = $5, offer = $6, offer_price = $7
//        WHERE id = $8
//        RETURNING *`,
//       [item_name, description, price, image_url, rating, offer, offer_price, id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Menu item not found" });
//     }

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error("Error updating menu item:", err);
//     res.status(500).json({ error: "Failed to update menu item" });
//   }
// });

// // ✅ Delete a menu item (admin only)
// router.delete("/restaurant-menu-items/:id", verifyUser, async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query(
//       "DELETE FROM restaurant_menu_items WHERE id = $1 RETURNING *",
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Menu item not found" });
//     }

//     res.json({ message: "Menu item deleted", item: result.rows[0] });
//   } catch (err) {
//     console.error("Error deleting menu item:", err);
//     res.status(500).json({ error: "Failed to delete menu item" });
//   }
// });

// module.exports = router;
