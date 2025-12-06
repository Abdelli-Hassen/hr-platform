import { Router, Response } from 'express';
import Department from '../models/Department';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();

// Get all departments
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
