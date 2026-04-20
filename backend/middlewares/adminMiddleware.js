const adminOnly = (req, res, next) => {
  if (req.user && req.user.email === process.env.ADMIN_EMAIL) {
    return next();
  }
  res.status(403).json({ message: "Access denied. Admins only." });
};

module.exports = { adminOnly };
