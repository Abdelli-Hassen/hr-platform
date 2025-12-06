import { Router, Response } from 'express';
import Leave from '../models/Leave';
import Absence from '../models/Absence';
import Employee from '../models/Employee';
import { AuthRequest, authenticateToken, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { employeeId } = req.query;
    const query: any = {};
    if (employeeId) {
      query.employeeId = employeeId;
    }

    const leaves = await Leave.find(query)
      .populate('employeeId')
      .sort({ createdAt: -1 });

    const formattedLeaves = leaves.map((leave: any) => ({
      id: leave._id,
      leaveId: leave._id,
      employeeId: leave.employeeId?._id,
      firstName: leave.employeeId?.firstName,
      lastName: leave.employeeId?.lastName,
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
      status: leave.status,
      approvalDate: leave.approvalDate,
      createdAt: leave.createdAt,
      updatedAt: leave.updatedAt
    }));

    res.json(formattedLeaves);
  } catch (error: any) {
    console.error('Get leaves error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;

    const leave = new Leave({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
      status: 'pending'
    });

    await leave.save();
    res.status(201).json({ id: leave._id });
  } catch (error: any) {
    console.error('Create leave error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, authorize('admin', 'manager'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await Leave.findByIdAndUpdate(id, {
      status,
      approvalDate: new Date()
    });

    if (status === 'approved') {
      const leave = await Leave.findById(id);
      if (leave && leave.employeeId) {
        await Employee.findByIdAndUpdate(leave.employeeId, { status: 'on_leave' });
      }
    }

    res.json({ message: 'Leave updated' });
  } catch (error: any) {
    console.error('Update leave error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/absences', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const absences = await Absence.find()
      .populate('employeeId')
      .sort({ absenceDate: -1 });

    const formattedAbsences = absences.map((absence: any) => ({
      id: absence._id,
      employeeId: absence.employeeId?._id,
      firstName: absence.employeeId?.firstName,
      lastName: absence.employeeId?.lastName,
      date: absence.absenceDate,
      type: absence.absenceType,
      reason: absence.reason,
      createdAt: absence.createdAt
    }));

    res.json(formattedAbsences);
  } catch (error: any) {
    console.error('Get absences error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/absences', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { employeeId, date, type, reason } = req.body;

    const absence = new Absence({
      employeeId,
      absenceDate: date,
      absenceType: type,
      reason
    });

    await absence.save();
    res.status(201).json({ id: absence._id });
  } catch (error: any) {
    console.error('Create absence error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
