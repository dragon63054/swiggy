// const express = require('express');
// const pool = require('../db/client.cjs');
// const { verifyUser } = require('../middleware/auth.cjs');

// const router = express.Router();

// // Get all restaurants
// router.get("/restaurants-menu", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM restaurant_menu_items");
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch restaurant-menu-items" });
//   }
// });

// // Get menu by restaurant ID
// router.get("/restaurant-menu-items/:restaurant_id", async (req, res) => {
//   const { restaurant_id } = req.params;
//   try {
//     const result = await pool.query(`
//       SELECT * FROM restaurant_menu_items WHERE restaurant_id = $1
//     `, [restaurant_id]);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "No menu items found" });
//     }
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch menu" });
//   }
// });

// // Add a new menu item
// router.post("/restaurant-menu-items", verifyUser, async (req, res) => {
//   const { restaurant_id, item_name, description, price, image_url, rating } = req.body;

//   try {
//     const result = await pool.query(`
//       INSERT INTO restaurant_menu_items (restaurant_id, item_name, description, price, image_url, rating)
//       VALUES ($1, $2, $3, $4, $5, $6)
//       RETURNING *
//     `, [restaurant_id, item_name, description, price, image_url, rating]);

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to add menu item" });
//   }
// });

// // Update menu item
// router.put("/restaurant-menu-items/:id", verifyUser, async (req, res) => {
//   const { id } = req.params;
//   const { item_name, description, price, image_url, rating } = req.body;

//   try {
//     const result = await pool.query(`
//       UPDATE restaurant_menu_items
//       SET item_name = $1, description = $2, price = $3, image_url = $4, rating = $5
//       WHERE id = $6
//       RETURNING *
//     `, [item_name, description, price, image_url, rating, id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Menu item not found" });
//     }

//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update menu item" });
//   }
// });

// // Delete menu item
// router.delete("/restaurant-menu-items/:id", verifyUser, async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query("DELETE FROM restaurant_menu_items WHERE id = $1 RETURNING *", [id]);
//     if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
//     res.json({ message: "Deleted", item: result.rows[0] });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete" });
//   }
// });

// module.exports = router;


// Add item - associate with admin's user_id
router.post("/restaurant-menu-items", verifyUser, async (req, res) => {
  const { restaurant_id, item_name, description, price, image_url, rating } = req.body;
  const user_id = req.user.id;

  try {
    const result = await pool.query(`
      INSERT INTO restaurant_menu_items (restaurant_id, item_name, description, price, image_url, rating, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [restaurant_id, item_name, description, price, image_url, rating, user_id]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add menu item" });
  }
});

// Get items for logged-in admin
router.get("/admin-menu", verifyUser, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM restaurant_menu_items WHERE user_id = $1",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin menu items" });
  }
});

// Update item (check user_id)
router.put("/restaurant-menu-items/:id", verifyUser, async (req, res) => {
  const { id } = req.params;
  const { item_name, description, price, image_url, rating } = req.body;

  try {
    const result = await pool.query(`
      UPDATE restaurant_menu_items
      SET item_name = $1, description = $2, price = $3, image_url = $4, rating = $5
      WHERE id = $6 AND user_id = $7
      RETURNING *
    `, [item_name, description, price, image_url, rating, id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized or item not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

// Delete item (check user_id)
router.delete("/restaurant-menu-items/:id", verifyUser, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      DELETE FROM restaurant_menu_items
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `, [id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized or item not found" });
    }

    res.json({ message: "Deleted", item: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});
