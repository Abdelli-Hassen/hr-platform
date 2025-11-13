"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || "admin@hrplatform.tn";
        const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";
        const emailInput = String(email || "").trim().toLowerCase();
        const passwordInput = String(password || "").trim();
        const defaultEmailNorm = String(defaultEmail).trim().toLowerCase();
        const defaultPasswordNorm = String(defaultPassword).trim();
        if (emailInput === defaultEmailNorm && passwordInput === defaultPasswordNorm) {
            const token = jsonwebtoken_1.default.sign({ user_id: 1, email: defaultEmail, role: "admin" }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "24h" });
            return res.json({
                token,
                user: {
                    id: 1,
                    email: defaultEmail,
                    role: "admin",
                    employee: null,
                },
            });
        }
        // Default demo employee fallback(s)
        const demoEmpEmail = (process.env.DEFAULT_EMP_EMAIL || "employee@hrplatform.tn").trim().toLowerCase();
        const demoEmpEmail2 = (process.env.DEFAULT_EMP_EMAIL2 || "m.benali@hrplatform.tn").trim().toLowerCase();
        const demoEmpPass = (process.env.DEFAULT_EMP_PASSWORD || "emp123").trim();
        if ((emailInput === demoEmpEmail || emailInput === demoEmpEmail2) && passwordInput === demoEmpPass) {
            const token = jsonwebtoken_1.default.sign({ user_id: 2, email: emailInput, role: "employee" }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "24h" });
            return res.json({
                token,
                user: {
                    id: 2,
                    email: emailInput,
                    role: "employee",
                    employee: null,
                },
            });
        }
        const [rows] = await (0, database_1.query)("SELECT * FROM users WHERE email = ?", [emailInput]);
        if (!rows.length) {
            console.log('LOGIN NOT FOUND', { email });
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }
        const user = rows[0];
        console.log('LOGIN ATTEMPT', { inputEmail: email, dbEmail: user.email });
        console.log('DEBUG PASS', {
            inputPass: password,
            dbPass: user.password_hash,
            inputLen: String(password).length,
            dbLen: String(user.password_hash).length,
            inputHex: Buffer.from(String(password), 'utf8').toString('hex'),
            dbHex: Buffer.from(String(user.password_hash), 'utf8').toString('hex')
        });
        // Plain text password comparison (exact)
        if (String(user.password_hash || "") !== passwordInput) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }
        const token = jsonwebtoken_1.default.sign({ user_id: user.user_id, email: user.email, role: user.role }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "24h" });
        // Get employee info if exists
        const [empRows] = await (0, database_1.query)("SELECT employee_id, first_name, last_name FROM employees WHERE user_id = ?", [
            user.user_id,
        ]);
        res.json({
            token,
            user: {
                id: user.user_id,
                email: user.email,
                role: user.role,
                employee: empRows.length ? {
                    employee_id: empRows[0].employee_id,
                    first_name: empRows[0].first_name,
                    last_name: empRows[0].last_name,
                } : null,
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});
router.post("/register", async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        // Store plain text password (no hashing)
        await (0, database_1.query)("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)", [email, password, "employee"]);
        res.status(201).json({ message: "Utilisateur créé avec succès" });
    }
    catch (error) {
        res.status(500).json({ error: "Erreur lors de la création du compte" });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map