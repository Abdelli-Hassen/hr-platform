import { Router, Response } from 'express';
import Employee from '../models/Employee';
import Job from '../models/Job';
import Department from '../models/Department';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { AuthRequest, authenticateToken, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const employees = await Employee.find()
      .populate('jobId')
      .populate('departmentId')
      .populate('managerId');

    const formattedEmployees = await Promise.all(employees.map(async (emp: any) => {
      const user = await User.findOne({ employeeId: emp._id });
      return {
        id: emp._id,
        employeeId: emp._id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        phoneNumber: emp.phone,
        hireDate: emp.hireDate,
        jobId: emp.jobId?._id,
        jobTitle: emp.jobTitle || emp.jobId?.jobTitle,
        salary: emp.salary,
        departmentId: emp.departmentId?._id,
        departmentName: emp.departmentId?.departmentName,
        managerId: emp.managerId?._id,
        cin: emp.cin,
        birthDate: emp.birthDate,
        nationality: emp.nationality,
        address: emp.address,
        city: emp.city,
        postalCode: emp.postalCode,
        contractType: emp.contractType,
        contractStart: emp.contractStart,
        contractEnd: emp.contractEnd,
        status: emp.status,
        createdAt: emp.createdAt,
        updatedAt: emp.updatedAt,
        visiblePassword: user?.visiblePassword
      }
    }));

    res.json(formattedEmployees);
  } catch (error: any) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/user/:userId', authenticateToken, async (req: AuthRequest, res: Response) => {
  // This route was finding employee by user_id.
  // Since I didn't put userId in Employee model, this is tricky.
  // But wait, User model has employeeId.
  // So I can find User by ID, then get the employeeId, then find Employee.
  try {
    const { userId } = req.params;
    // Actually, the original code had user_id in employees table.
    // If I want to support this, I should add userId to Employee model.
    // Or I can query User model first.
    // Let's assume the frontend passes the User ID (which is the MongoDB _id of the User).

    // Alternative: Find Employee where... wait, I don't have userId in Employee.
    // But User has employeeId.
    // So I should find the User first.

    /*
    const user = await User.findById(userId);
    if (!user || !user.employeeId) {
       return res.status(404).json({ error: 'Employee not found' });
    }
    const employee = await Employee.findById(user.employeeId)...
    */

    // However, the route is /user/:userId.
    // I'll try to implement it via User model lookup if I can import User.
    // But I don't want circular deps if possible.
    // Let's just import User.

    // Wait, I'll add userId to Employee model to make it easier and consistent with original design.
    // It's a 1-to-1 relationship usually.
    // I'll update Employee model in a separate step or just assume it's there for now and fix model later?
    // No, I should fix the model first.
    // But I can't interrupt this tool call sequence easily.
    // I will use the User lookup method for now.

    // Actually, I'll skip this route implementation for a second and fix the model first?
    // No, I'll write the code assuming I'll fix the model.
    // I will add `userId` to Employee model.

    // For now, let's comment out this route or implement it with a TODO note if I can't fix model now.
    // I will implement it assuming userId is present in Employee model.
    // And I will update Employee model in the next step.

    /*
    const employee = await Employee.findOne({ userId: userId }) ...
    */

    // Wait, I can't verify if userId is in the model effectively without checking.
    // I know it's NOT there because I wrote the model.
    // So I will use the User lookup approach.

    // I need to import User.
    const User = require('../models/User').default;
    const user = await User.findById(userId);

    if (!user || !user.employeeId) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const employee = await Employee.findById(user.employeeId)
      .populate('jobId')
      .populate('departmentId')
      .populate('managerId');

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const formattedEmployee = {
      id: employee._id,
      employeeId: employee._id,
      userId: userId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phoneNumber: employee.phone,
      hireDate: employee.hireDate,
      jobId: employee.jobId?._id,
      jobTitle: (employee.jobId as any)?.jobTitle,
      salary: employee.salary,
      departmentId: employee.departmentId?._id,
      departmentName: (employee.departmentId as any)?.departmentName,
      managerId: employee.managerId?._id,
      cin: employee.cin,
      birthDate: employee.birthDate,
      nationality: employee.nationality,
      address: employee.address,
      city: employee.city,
      postalCode: employee.postalCode,
      contractType: employee.contractType,
      contractStart: employee.contractStart,
      contractEnd: employee.contractEnd,
      status: employee.status,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt
    };

    res.json(formattedEmployee);

  } catch (error: any) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Authorization check: Admin or the employee themselves
    // We need to check if the requesting user is linked to this employee
    // req.user is populated by authenticateToken

    // If not admin, check ownership
    if (req.user?.role !== 'admin') {
      // We need to find the user linked to this employee to check if it matches req.user.id
      // OR check if req.user.employeeId matches id
      // The token payload usually has employeeId if we put it there.
      // Let's check auth.ts login payload.
      // It has { id: user._id, email: user.email, role: user.role }
      // It does NOT have employeeId in the token payload directly?
      // Wait, let's check auth.ts again.

      // In auth.ts:
      // const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, ...)

      // So req.user has { id, email, role }.
      // We need to check if the User (req.user.id) is linked to Employee (id).

      const requestingUser = await User.findById(req.user.id);
      if (!requestingUser || requestingUser.employeeId?.toString() !== id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const employee = await Employee.findById(id)
      .populate('jobId')
      .populate('departmentId')
      .populate('managerId');

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Get User for password visibility
    const user = await User.findOne({ employeeId: employee._id });

    const formattedEmployee = {
      id: employee._id,
      employeeId: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phoneNumber: employee.phone,
      hireDate: employee.hireDate,
      jobId: employee.jobId?._id,
      jobTitle: (employee.jobId as any)?.jobTitle || employee.jobTitle,
      salary: employee.salary,
      departmentId: employee.departmentId?._id,
      departmentName: (employee.departmentId as any)?.departmentName,
      managerId: employee.managerId?._id,
      cin: employee.cin,
      birthDate: employee.birthDate,
      nationality: employee.nationality,
      address: employee.address,
      city: employee.city,
      postalCode: employee.postalCode,
      contractType: employee.contractType,
      contractStart: employee.contractStart,
      contractEnd: employee.contractEnd,
      status: employee.status,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
      visiblePassword: user?.visiblePassword
    };

    res.json(formattedEmployee);
  } catch (error: any) {
    console.error('Get employee by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const {
      firstName, lastName, email, phoneNumber, hireDate, jobId,
      salary, departmentId, managerId, cin, birthDate, nationality,
      address, city, postalCode, contractType, contractStart, contractEnd, status
    } = req.body;

    const employee = new Employee({
      firstName,
      lastName,
      email,
      phone: phoneNumber,
      jobId,
      jobTitle: req.body.jobTitle,
      salary,
      departmentId,
      managerId,
      cin,
      birthDate,
      nationality,
      address,
      city,
      postalCode,
      contractType,
      contractStart,
      contractEnd,
      status: status || 'active',
      hireDate: hireDate || new Date()
    });

    await employee.save();

    // Create or Update User account if password is provided
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        {
          email: email.toLowerCase(),
          password: hashedPassword,
          visiblePassword: req.body.password,
          role: 'employee',
          employeeId: employee._id
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    res.status(201).json({ id: employee._id });
  } catch (error: any) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Map frontend keys to model keys if necessary (e.g. phoneNumber -> phone)
    if (updates.phoneNumber) {
      updates.phone = updates.phoneNumber;
      delete updates.phoneNumber;
    }

    // Handle password update
    if (updates.password) {
      const hashedPassword = await bcrypt.hash(updates.password, 10);

      // We need the email to create a new user if one doesn't exist
      let userEmail = updates.email;
      if (!userEmail) {
        const emp = await Employee.findById(id);
        userEmail = emp?.email;
      }

      if (userEmail) {
        await User.findOneAndUpdate(
          { email: userEmail.toLowerCase() }, // Find by email to avoid duplicate key error
          {
            email: userEmail.toLowerCase(),
            password: hashedPassword,
            visiblePassword: updates.password,
            role: 'employee',
            employeeId: id
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
      delete updates.password;
    }

    await Employee.findByIdAndUpdate(id, updates);
    res.json({ message: 'Employee updated' });
  } catch (error: any) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (employee) {
      // Delete linked user by employeeId OR email to ensure cleanup
      await User.findOneAndDelete({
        $or: [
          { employeeId: id },
          { email: employee.email }
        ]
      });
      await Employee.findByIdAndDelete(id);
    }

    res.json({ message: 'Employee deleted' });
  } catch (error: any) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
