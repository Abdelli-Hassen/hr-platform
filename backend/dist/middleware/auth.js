"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.managerOrAdmin = exports.adminOnly = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token non fourni" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
        req.user = decoded;
        req.userId = decoded.user_id;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Token invalide" });
    }
};
exports.authMiddleware = authMiddleware;
const adminOnly = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ error: "Accès administrateur requis" });
    }
    next();
};
exports.adminOnly = adminOnly;
const managerOrAdmin = (req, res, next) => {
    if (!["admin", "manager"].includes(req.user?.role)) {
        return res.status(403).json({ error: "Accès refusé" });
    }
    next();
};
exports.managerOrAdmin = managerOrAdmin;
//# sourceMappingURL=auth.js.map