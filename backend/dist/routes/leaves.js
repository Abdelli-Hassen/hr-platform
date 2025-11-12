"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get leaves
router.get("/", auth_1.authMiddleware, async (req, res) => {
    try {
        const { employeeId } = req.query;
        let sql = `SELECT l.*, e.first_name, e.last_name FROM leaves l
               LEFT JOIN employees e ON l.employee_id = e.employee_id WHERE 1=1`;
        const params = [];
        if (employeeId) {
            sql += " AND l.employee_id = ?";
            params.push(employeeId);
        }
        const [rows] = await (0, database_1.query)(sql, params);
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des congés" });
    }
});
// Request leave
router.post("/", auth_1.authMiddleware, async (req, res) => {
    try {
        const { employeeId, leaveType, startDate, endDate, reason } = req.body;
        await (0, database_1.query)(`INSERT INTO leaves (employee_id, leave_type, start_date, end_date, reason, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`, [employeeId, leaveType, startDate, endDate, reason]);
        res.status(201).json({ message: "Demande de congé créée" });
    }
    catch (error) {
        res.status(500).json({ error: "Erreur lors de la création de la demande" });
    }
});
// Approve/Reject leave
router.put("/:id", auth_1.authMiddleware, auth_1.managerOrAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;
        await (0, database_1.query)("UPDATE leaves SET status = ?, rejection_reason = ?, approval_date = NOW() WHERE leave_id = ?", [
            status,
            rejectionReason || null,
            id,
        ]);
        res.json({ message: "Congé mis à jour" });
    }
    catch (error) {
        res.status(500).json({ error: "Erreur lors de la mise à jour" });
    }
});
exports.default = router;
//# sourceMappingURL=leaves.js.map