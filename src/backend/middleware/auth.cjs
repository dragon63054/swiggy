const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

function verifyUser(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch {
    res.status(400).json({ error: 'Invalid token' });
  }
}
// app.get('/test-db', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT NOW()');
//     res.send(`Database connected! Time: ${result.rows[0].now}`);
//   } catch (err) {
//     console.error("Database test failed:", err);
//     res.status(500).send("Database connection failed");
//   }
// });

function verifyAdmin(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const decoded = jwt.verify(token, secret);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    req.user = decoded;
    next();
  } catch {
    res.status(400).json({ error: 'Invalid token' });
  }
}

module.exports = { verifyUser, verifyAdmin };
