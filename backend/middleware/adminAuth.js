const jwt = require("jsonwebtoken");

// Protects admin-only actions (creating/editing/deleting books, accepting or
// rejecting offers, etc). Requires a valid token issued by POST /api/admin/login.
function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Admin login required" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired admin session, please log in again" });
  }
}

module.exports = adminAuth;
