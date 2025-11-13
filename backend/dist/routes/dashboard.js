"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
router.get("/admin/stats", async (_req, res) => {
    try {
        const [empCount] = await (0, database_1.query)("SELECT COUNT(*) AS totalEmployees FROM employees");
        const totalEmployees = empCount[0]?.totalEmployees || 0;
        const [activeEmpCount] = await (0, database_1.query)("SELECT COUNT(*) AS activeEmployees FROM users u JOIN employees e ON u.user_id = e.user_id WHERE u.is_active = TRUE");
        const activeEmployees = activeEmpCount[0]?.activeEmployees || totalEmployees;
        const [payrollSum] = await (0, database_1.query)("SELECT COALESCE(SUM(salary),0) AS totalPayroll FROM employees");
        const totalPayroll = Number(payrollSum[0]?.totalPayroll || 0);
        const [pendingLeaves] = await (0, database_1.query)("SELECT COUNT(*) AS pendingLeaves FROM leaves WHERE status = 'pending'");
        const pendingLeavesCount = pendingLeaves[0]?.pendingLeaves || 0;
        const [openJobs] = await (0, database_1.query)("SELECT COUNT(*) AS openPositions FROM job_openings WHERE status = 'open'");
        const openPositions = openJobs[0]?.openPositions || 0;
        const [newCands] = await (0, database_1.query)("SELECT COUNT(*) AS newCandidates FROM candidates WHERE application_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)");
        const newCandidates = newCands[0]?.newCandidates || 0;
        res.json({
            totalEmployees,
            activeEmployees,
            totalPayroll,
            pendingLeaves: pendingLeavesCount,
            openPositions,
            newCandidates,
        });
    }
    catch (error) {
        res.json({ totalEmployees: 0, activeEmployees: 0, totalPayroll: 0, pendingLeaves: 0, openPositions: 0, newCandidates: 0 });
    }
});
router.get("/employee/:employeeId/stats", async (req, res) => {
    try {
        const { employeeId } = req.params;
        const [leavesTakenRows] = await (0, database_1.query)("SELECT COALESCE(SUM(DATEDIFF(end_date, start_date) + 1), 0) AS days FROM leaves WHERE employee_id = ? AND status = 'approved'", [employeeId]);
        const leavesTaken = Number(leavesTakenRows[0]?.days || 0);
        const remainingLeave = Math.max(0, 30 - leavesTaken);
        const [lastPayroll] = await (0, database_1.query)("SELECT net_salary AS netSalary FROM payroll WHERE employee_id = ? ORDER BY year DESC, month DESC LIMIT 1", [employeeId]);
        const lastPayrollNet = Number(lastPayroll[0]?.netSalary || 0);
        res.json({ leavesTaken, remainingLeave, lastPayrollNet });
    }
    catch (error) {
        res.json({ leavesTaken: 0, remainingLeave: 0, lastPayrollNet: 0 });
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map