import { Router, Response } from 'express';
import JobOpening from '../models/JobOpening';
import Candidate from '../models/Candidate';
import { AuthRequest, authenticateToken, authorize } from '../middleware/auth';

const router = Router();

router.get('/openings', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const openings = await JobOpening.find()
      .populate('departmentId')
      .sort({ postedDate: -1 });

    const formattedOpenings = openings.map((jo: any) => ({
      id: jo._id,
      job_opening_id: jo._id,
      jobTitle: jo.jobTitle,
      departmentId: jo.departmentId?._id,
      departmentName: jo.departmentId?.departmentName,
      positionCount: jo.positionCount,
      description: jo.description,
      requirements: jo.requirements,
      salaryMin: jo.salaryMin,
      salaryMax: jo.salaryMax,
      status: jo.status,
      postedDate: jo.postedDate,
      createdAt: jo.createdAt,
      updatedAt: jo.updatedAt
    }));

    res.json(formattedOpenings);
  } catch (error: any) {
    console.error('Get job openings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/openings', authenticateToken, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { jobTitle, departmentId, positionCount, description, requirements, salaryMin, salaryMax, status } = req.body;

    const opening = new JobOpening({
      jobTitle,
      departmentId,
      positionCount,
      description,
      requirements,
      salaryMin,
      salaryMax,
      status: status || 'open'
    });

    await opening.save();
    res.status(201).json({ id: opening._id });
  } catch (error: any) {
    console.error('Create job opening error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/candidates', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const candidates = await Candidate.find()
      .populate('jobOpeningId')
      .sort({ createdAt: -1 });

    const formattedCandidates = candidates.map((c: any) => ({
      id: c._id,
      candidate_id: c._id,
      job_opening_id: c.jobOpeningId?._id,
      first_name: c.firstName,
      last_name: c.lastName,
      email: c.email,
      phone_number: c.phoneNumber,
      cv_path: c.cvPath,
      cover_letter: c.coverLetter,
      status: c.status,
      created_at: c.createdAt,
      updated_at: c.updatedAt,
      jobTitle: c.jobOpeningId?.jobTitle
    }));

    res.json(formattedCandidates);
  } catch (error: any) {
    console.error('Get candidates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/candidates', async (req: AuthRequest, res: Response) => {
  try {
    const { jobOpeningId, firstName, lastName, email, phoneNumber, coverLetter } = req.body;

    const candidate = new Candidate({
      jobOpeningId,
      firstName,
      lastName,
      email,
      phoneNumber,
      coverLetter,
      status: 'submitted'
    });

    await candidate.save();
    res.status(201).json({ id: candidate._id });
  } catch (error: any) {
    console.error('Create candidate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/candidates/:id', authenticateToken, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await Candidate.findByIdAndUpdate(id, { status });
    res.json({ message: 'Candidate updated' });
  } catch (error: any) {
    console.error('Update candidate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/openings/:id/close', authenticateToken, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await JobOpening.findByIdAndUpdate(id, { status: 'closed' });
    res.json({ message: 'Job opening closed' });
  } catch (error: any) {
    console.error('Close job opening error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
