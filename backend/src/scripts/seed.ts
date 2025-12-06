import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Department from '../models/Department';
import Job from '../models/Job';
import User from '../models/User';
import Employee from '../models/Employee';
import Payroll from '../models/Payroll';
import Leave from '../models/Leave';
import JobOpening from '../models/JobOpening';
import Candidate from '../models/Candidate';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hr-platform';

const firstNames = [
    'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth',
    'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
    'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra',
    'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
    'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa', 'Edward', 'Deborah'
];

const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

function getRandomElement(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generatePhoneNumber() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

function getRandomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedDatabase() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Department.deleteMany({});
        await Job.deleteMany({});
        await User.deleteMany({});
        await Employee.deleteMany({});
        await Payroll.deleteMany({});
        await Leave.deleteMany({});
        await JobOpening.deleteMany({});
        await Candidate.deleteMany({});
        console.log('Cleared existing data.');

        // Create Departments
        const departments = await Department.insertMany([
            { departmentName: 'Human Resources', location: 'Building A' },
            { departmentName: 'IT', location: 'Building B' },
            { departmentName: 'Finance', location: 'Building A' },
            { departmentName: 'Marketing', location: 'Building C' },
            { departmentName: 'Sales', location: 'Building C' },
            { departmentName: 'Operations', location: 'Building B' }
        ]);
        console.log('Departments created.');

        // Create Jobs (Salaries 1200 - 3500)
        const jobs = await Job.insertMany([
            { jobTitle: 'HR Manager', minSalary: 2500, maxSalary: 3500 },
            { jobTitle: 'Software Engineer', minSalary: 2000, maxSalary: 3500 },
            { jobTitle: 'Accountant', minSalary: 1800, maxSalary: 3000 },
            { jobTitle: 'Marketing Specialist', minSalary: 1500, maxSalary: 2800 },
            { jobTitle: 'Sales Representative', minSalary: 1200, maxSalary: 2500 },
            { jobTitle: 'Operations Manager', minSalary: 2200, maxSalary: 3200 },
            { jobTitle: 'Data Analyst', minSalary: 1900, maxSalary: 3100 },
            { jobTitle: 'Product Manager', minSalary: 2800, maxSalary: 3500 }
        ]);
        console.log('Jobs created.');

        // 1. Create Admin User
        const adminPassword = await bcrypt.hash('admin123', 10);
        const hrDept = departments.find(d => d.departmentName === 'Human Resources');
        const hrJob = jobs.find(j => j.jobTitle === 'HR Manager');

        const adminEmployee = new Employee({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@company.com',
            phone: '1234567890',
            jobId: hrJob?._id,
            jobTitle: 'HR Manager',
            departmentId: hrDept?._id,
            salary: 3500,
            hireDate: new Date('2020-01-01'),
            status: 'active',
            contractType: 'CDI',
            address: '123 Admin St, New York, NY',
            city: 'New York',
            postalCode: '10001',
            nationality: 'American',
            birthDate: new Date('1985-05-15'),
            cin: 'A12345678'
        });
        await adminEmployee.save();

        const adminUser = new User({
            email: 'admin@company.com',
            password: adminPassword,
            visiblePassword: 'admin123',
            role: 'admin',
            employeeId: adminEmployee._id
        });
        await adminUser.save();
        console.log('Admin user created.');

        // 2. Create 99 Random Employees
        const commonPasswordHash = await bcrypt.hash('password123', 10);
        const employees = [adminEmployee];

        for (let i = 0; i < 99; i++) {
            const firstName = getRandomElement(firstNames);
            const lastName = getRandomElement(lastNames);
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`;
            const dept = departments[Math.floor(Math.random() * departments.length)];
            const job = jobs[Math.floor(Math.random() * jobs.length)];

            // Salary between min and max, clamped to 1200-3500 range logic
            const salary = Math.floor(job.minSalary + Math.random() * (job.maxSalary - job.minSalary));

            const employee = new Employee({
                firstName,
                lastName,
                email,
                phone: generatePhoneNumber(),
                jobId: job._id,
                jobTitle: job.jobTitle,
                departmentId: dept._id,
                salary: salary,
                hireDate: getRandomDate(new Date('2020-01-01'), new Date()),
                status: Math.random() > 0.1 ? 'active' : 'inactive',
                contractType: Math.random() > 0.2 ? 'CDI' : 'CDD',
                address: `${Math.floor(Math.random() * 999)} Main St`,
                city: 'New York',
                postalCode: '10001',
                nationality: 'American',
                birthDate: getRandomDate(new Date('1965-01-01'), new Date('2000-01-01')),
                cin: `ID${Math.floor(Math.random() * 1000000)}`,
                managerId: adminEmployee._id
            });

            await employee.save();
            employees.push(employee);

            const user = new User({
                email: email,
                password: commonPasswordHash,
                visiblePassword: 'password123',
                role: 'employee',
                employeeId: employee._id
            });
            await user.save();
        }
        console.log('99 Employees created.');

        // 3. Create Payrolls (Last Month)
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1; // 1-12
        const payrollMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const payrollYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        for (const emp of employees) {
            const baseSalary = emp.salary;
            const allowances = Math.floor(Math.random() * 200);
            const deductions = Math.floor(Math.random() * 100);
            const taxes = Math.floor(baseSalary * 0.15);
            const netSalary = baseSalary + allowances - deductions - taxes;

            const payroll = new Payroll({
                employeeId: emp._id,
                month: payrollMonth,
                year: payrollYear,
                baseSalary,
                allowances,
                deductions,
                taxes,
                netSalary,
                status: Math.random() > 0.5 ? 'paid' : (Math.random() > 0.5 ? 'validated' : 'pending'),
                paymentDate: Math.random() > 0.5 ? new Date() : undefined,
                currency: 'TND'
            });
            await payroll.save();
        }
        console.log('Payrolls created.');

        // 4. Create Leaves
        const leaveTypes = ['Annual', 'Sick', 'Unpaid', 'Maternity/Paternity'];
        for (const emp of employees) {
            if (Math.random() > 0.3) { // 70% chance of having a leave
                const startDate = getRandomDate(new Date('2023-01-01'), new Date());
                const endDate = new Date(startDate.getTime() + Math.random() * 1000 * 60 * 60 * 24 * 5); // 1-5 days

                const leave = new Leave({
                    employeeId: emp._id,
                    leaveType: getRandomElement(leaveTypes),
                    startDate,
                    endDate,
                    reason: 'Personal reasons',
                    status: Math.random() > 0.3 ? 'approved' : (Math.random() > 0.5 ? 'rejected' : 'pending'),
                    approvalDate: Math.random() > 0.3 ? new Date() : undefined
                });
                await leave.save();
            }
        }
        console.log('Leaves created.');

        // 5. Create Job Openings & Candidates
        for (const job of jobs) {
            if (Math.random() > 0.5) { // 50% chance of job opening
                const opening = new JobOpening({
                    jobTitle: job.jobTitle,
                    departmentId: departments[Math.floor(Math.random() * departments.length)]._id,
                    positionCount: Math.floor(Math.random() * 3) + 1,
                    description: `We are looking for a skilled ${job.jobTitle} to join our team.`,
                    requirements: 'Bachelor degree, 2+ years experience.',
                    salaryMin: job.minSalary,
                    salaryMax: job.maxSalary,
                    status: 'open',
                    postedDate: getRandomDate(new Date('2023-01-01'), new Date())
                });
                await opening.save();

                // Create Candidates for this opening
                const numCandidates = Math.floor(Math.random() * 5);
                for (let k = 0; k < numCandidates; k++) {
                    const cFirstName = getRandomElement(firstNames);
                    const cLastName = getRandomElement(lastNames);
                    const candidate = new Candidate({
                        jobOpeningId: opening._id,
                        firstName: cFirstName,
                        lastName: cLastName,
                        email: `${cFirstName.toLowerCase()}.${cLastName.toLowerCase()}@candidate.com`,
                        phoneNumber: generatePhoneNumber(),
                        status: getRandomElement(['submitted', 'interviewing', 'hired', 'rejected'])
                    });
                    await candidate.save();
                }
            }
        }
        console.log('Recruitment data created.');

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
