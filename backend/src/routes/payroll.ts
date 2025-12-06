import { Router, Response } from 'express';
import Payroll from '../models/Payroll';
import { AuthRequest, authenticateToken, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { employeeId } = req.query;
    const query: any = {};
    if (employeeId) {
      query.employeeId = employeeId;
    }

    const payrolls = await Payroll.find(query)
      .populate('employeeId')
      .sort({ year: -1, month: -1 });

    const formattedPayrolls = payrolls.map((p: any) => ({
      id: p._id,
      payrollId: p._id,
      employeeId: p.employeeId?._id,
      firstName: p.employeeId?.firstName,
      lastName: p.employeeId?.lastName,
      month: p.month,
      year: p.year,
      baseSalary: p.baseSalary,
      allowances: p.allowances,
      deductions: p.deductions,
      taxes: p.taxes,
      netSalary: p.netSalary,
      status: p.status,
      paymentDate: p.paymentDate,
      currency: p.currency,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }));

    res.json(formattedPayrolls);
  } catch (error: any) {
    console.error('Get payroll error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const {
      employeeId, month, year, baseSalary, allowances,
      deductions, taxes, netSalary, status, paymentDate
    } = req.body;

    const payroll = new Payroll({
      employeeId,
      month,
      year,
      baseSalary,
      allowances,
      deductions,
      taxes,
      netSalary,
      status: status || 'draft',
      paymentDate
    });

    await payroll.save();
    res.status(201).json({ id: payroll._id });
  } catch (error: any) {
    console.error('Create payroll error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    await Payroll.findByIdAndUpdate(id, updates);
    res.json({ message: 'Payroll updated' });
  } catch (error: any) {
    console.error('Update payroll error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
