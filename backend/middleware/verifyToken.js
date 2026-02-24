import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("❌ Token verification failed:", err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      req.userId = decoded.id; // attach user id to request
      next();
    });
  } catch (error) {
    console.error("verifyToken error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
