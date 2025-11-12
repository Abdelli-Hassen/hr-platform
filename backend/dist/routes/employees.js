"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all employees
router.get("/", auth_1.authMiddleware, async (req, res) => {
    try {
        const [rows] = await (0, database_1.query)(`SELECT e.*, j.job_title, d.department_name FROM employees e
       LEFT JOIN jobs j ON e.job_id = j.job_id
       LEFT JOIN departments d ON e.department_id = d.department_id
       ORDER BY e.last_name, e.first_name`);
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des employés" });
    }
});
// Get employee by ID
router.get("/:id", auth_1.authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await (0, database_1.query)(`SELECT e.*, j.job_title, d.department_name FROM employees e
       LEFT JOIN jobs j ON e.job_id = j.job_id
       LEFT JOIN departments d ON e.department_id = d.department_id
       WHERE e.employee_id = ?`, [id]);
        if (!rows.length) {
            return res.status(404).json({ error: "Employé non trouvé" });
        }
        res.json(rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});
// Create employee
router.post("/", auth_1.authMiddleware, auth_1.adminOnly, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, hireDate, jobId, salary, departmentId, cin, birthDate, nationality, contractType, contractStart, } = req.body;
        await (0, database_1.query)(`INSERT INTO employees 
       (first_name, last_name, email, phone_number, hire_date, job_id, salary, department_id, cin, birth_date, nationality, contract_type, contract_start)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            firstName,
            lastName,
            email,
            phone,
            hireDate,
            jobId,
            salary,
            departmentId,
            cin,
            birthDate,
            nationality,
            contractType,
            contractStart,
        ]);
        res.status(201).json({ message: "Employé créé avec succès" });
    }
    catch (error) {
        res.status(500).json({ error: "Erreur lors de la création de l'employé" });
    }
});
// Update employee
router.put("/:id", auth_1.authMiddleware, auth_1.managerOrAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const setClauses = [];
        const values = [];
        Object.entries(updates).forEach(([key, value]) => {
            setClauses.push(`${key} = ?`);
            values.push(value);
        });
        values.push(id);
        if (setClauses.length === 0) {
            return res.status(400).json({ error: "Aucune donnée à mettre à jour" });
        }
        await (0, database_1.query)(`UPDATE employees SET ${setClauses.join(", ")} WHERE employee_id = ?`, values);
        res.json({ message: "Employé mis à jour avec succès" });
    }
    catch (error) {
        res.status(500).json({ error: "Erreur lors de la mise à jour" });
    }
});
exports.default = router;
//# sourceMappingURL=employees.js.map