const jwt = require("jsonwebtoken");
const SystemUser = require("../models/SystemUser");
const User = require("../models/User");

async function protectSystemUser(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.kind !== "admin") {
        return res.status(403).json({ message: "Not authorized as admin" });
      }

      req.user = await SystemUser.findById(decoded.sub).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed: " + error.message });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
}

async function protectUser(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.kind !== "user") {
        return res.status(403).json({ message: "Not authorized as user" });
      }

      req.user = await User.findById(decoded.sub).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed: " + error.message });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
}

async function protectJobPoster(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.kind === "admin") {
        req.user = await SystemUser.findById(decoded.sub).select("-password");
        if (!req.user) {
          return res.status(401).json({ message: "Not authorized, admin not found" });
        }
        req.userModel = "SystemUser";
        next();
      } else if (decoded.kind === "user") {
        const user = await User.findById(decoded.sub).select("-password");
        if (!user) {
          return res.status(401).json({ message: "Not authorized, user not found" });
        }
        if (user.type !== "company") {
          return res.status(403).json({ message: "Only company users can post jobs" });
        }
        req.user = user;
        req.userModel = "User";
        next();
      } else {
        return res.status(403).json({ message: "Not authorized to post jobs" });
      }
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
}

module.exports = { protectSystemUser, protectUser, protectJobPoster };
