import { Router, Response } from 'express';
import Employee from '../models/Employee';
import Leave from '../models/Leave';
import JobOpening from '../models/JobOpening';
import Candidate from '../models/Candidate';
import Payroll from '../models/Payroll';
import Absence from '../models/Absence';
import { AuthRequest, authenticateToken, authorize } from '../middleware/auth';

const router = Router();

router.get('/admin/stats', authenticateToken, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'active' });

    // Calculate total payroll (sum of salaries)
    // Note: This is sum of 'salary' field in Employee model (base salary), 
    // or should it be from Payroll table?
    // Original query: SELECT SUM(salary) FROM employees WHERE salary IS NOT NULL
    const payrollResult = await Employee.aggregate([
      { $match: { salary: { $ne: null } } },
      { $group: { _id: null, total: { $sum: '$salary' } } }
    ]);
    const totalPayroll = payrollResult.length > 0 ? payrollResult[0].total : 0;

    const pendingLeaves = await Leave.countDocuments({ status: 'pending' });
    const openPositions = await JobOpening.countDocuments({ status: 'open' });
    const newCandidates = await Candidate.countDocuments({ status: 'submitted' });

    res.json({
      totalEmployees,
      activeEmployees,
      totalPayroll,
      pendingLeaves,
      openPositions,
      newCandidates
    });
  } catch (error: any) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/employee/:employeeId/stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { employeeId } = req.params;

    const leavesTaken = await Leave.countDocuments({
      employeeId,
      status: 'approved'
    });

    const absences = await Absence.countDocuments({ employeeId });

    // Get last payroll net salary
    const lastPayroll = await Payroll.findOne({ employeeId })
      .sort({ year: -1, month: -1 });

    const lastPayrollNet = lastPayroll ? lastPayroll.netSalary : 0;
    const remainingLeave = Math.max(0, 30 - leavesTaken);

    res.json({
      leavesTaken,
      remainingLeave,
      lastPayrollNet
    });
  } catch (error: any) {
    console.error('Get employee stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
