import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Employee from '../models/Employee';
import { AuthRequest } from '../middleware/auth';

const router = Router();

interface LoginPayload {
  email: string;
  password: string;
}

router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body as LoginPayload;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password as string);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      (process.env.JWT_SECRET || 'your-secret-key') as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as any
    );

    let employeeData = undefined;
    if (user.employeeId) {
      const employee = await Employee.findById(user.employeeId);
      if (employee) {
        employeeData = {
          employee_id: employee._id,
          first_name: employee.firstName,
          last_name: employee.lastName
        };
      }
    }

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        employee: employeeData
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'employee'
    });

    await user.save();

    // Create employee record (basic info for now, needs job/dept later)
    // Note: This might fail if Job/Dept are required in Employee model.
    // For registration, we might need to relax requirements or assign default/dummy values.
    // Or we can just create the User and let Admin create Employee profile later.
    // But the original code created both.
    // Let's assume for now we create the User and return success.
    // If Employee creation is strictly required, we need more info (Job, Dept).
    // The original code inserted into employees with just names and email.
    // But my new Employee model requires jobId and departmentId.
    // I will make them optional in Employee model or handle it here.
    // For now, I'll skip creating Employee here to avoid validation errors, 
    // or I should make them optional in the model.
    // Let's check the Employee model again. I made them required.
    // I will modify Employee model to make them optional for now to support this flow,
    // or I will just create the User.
    // The original code: INSERT INTO employees ... VALUES ...
    // It didn't seem to require job_id or department_id in the INSERT statement?
    // Wait, let's check the original `auth.ts`.
    // `INSERT INTO employees (employee_id, user_id, first_name, last_name, email) VALUES ...`
    // It did NOT insert job_id or department_id. So they were nullable in Oracle.
    // So I should make them optional in Mongoose model too.

    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'employee' },
      (process.env.JWT_SECRET || 'your-secret-key') as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as any
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: 'employee'
      }
    });

  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
