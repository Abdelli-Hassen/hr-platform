DROP SCHEMA IF EXISTS human_ressources;
CREATE SCHEMA human_ressources COLLATE utf8mb4_general_ci;
USE human_ressources;

-- Regions Table
CREATE TABLE regions (
  region_id INT UNSIGNED NOT NULL PRIMARY KEY,
  region_name VARCHAR(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Countries Table
CREATE TABLE countries (
  country_id CHAR(2) NOT NULL PRIMARY KEY,
  country_name VARCHAR(40) NOT NULL,
  region_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (region_id) REFERENCES regions(region_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Locations Table
CREATE TABLE locations (
  location_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  street_address VARCHAR(40),
  postal_code VARCHAR(12),
  city VARCHAR(30) NOT NULL,
  state_province VARCHAR(25),
  country_id CHAR(2) NOT NULL,
  FOREIGN KEY (country_id) REFERENCES countries(country_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Departments Table
CREATE TABLE departments (
  department_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL,
  manager_id INT UNSIGNED,
  location_id INT UNSIGNED,
  FOREIGN KEY (location_id) REFERENCES locations(location_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Jobs Table
CREATE TABLE jobs (
  job_id VARCHAR(10) NOT NULL PRIMARY KEY,
  job_title VARCHAR(35) NOT NULL,
  min_salary DECIMAL(10, 2) UNSIGNED,
  max_salary DECIMAL(10, 2) UNSIGNED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Users Table (for authentication)
CREATE TABLE users (
  user_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'employee', 'manager') NOT NULL DEFAULT 'employee',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Employees Table
CREATE TABLE employees (
  employee_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(25) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone_number VARCHAR(20),
  hire_date DATE NOT NULL,
  job_id VARCHAR(10) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  commission_pct DECIMAL(4, 2),
  manager_id INT UNSIGNED,
  department_id INT UNSIGNED,
  user_id INT UNSIGNED,
  cin VARCHAR(20),
  birth_date DATE,
  nationality VARCHAR(50),
  address VARCHAR(255),
  city VARCHAR(50),
  postal_code VARCHAR(10),
  contract_type ENUM('CDI', 'CDD', 'Stage') NOT NULL DEFAULT 'CDI',
  contract_start DATE,
  contract_end DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(job_id),
  FOREIGN KEY (department_id) REFERENCES departments(department_id),
  FOREIGN KEY (manager_id) REFERENCES employees(employee_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Job History Table
CREATE TABLE job_history (
  job_history_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  employee_id INT UNSIGNED NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  job_id VARCHAR(10) NOT NULL,
  department_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
  FOREIGN KEY (job_id) REFERENCES jobs(job_id),
  FOREIGN KEY (department_id) REFERENCES departments(department_id),
  UNIQUE KEY uk_employee_start (employee_id, start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Payroll Table
CREATE TABLE payroll (
  payroll_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  employee_id INT UNSIGNED NOT NULL,
  month INT NOT NULL,
  year INT NOT NULL,
  base_salary DECIMAL(10, 2) NOT NULL,
  allowances DECIMAL(10, 2) DEFAULT 0,
  deductions DECIMAL(10, 2) DEFAULT 0,
  taxes DECIMAL(10, 2) DEFAULT 0,
  net_salary DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'calculated', 'validated', 'paid') DEFAULT 'pending',
  payment_date DATE,
  currency VARCHAR(3) DEFAULT 'TND',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
  UNIQUE KEY uk_payroll (employee_id, month, year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Leaves and Absences Table
CREATE TABLE leaves (
  leave_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  employee_id INT UNSIGNED NOT NULL,
  leave_type ENUM('annual', 'sick', 'unpaid', 'maternity', 'special') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(255),
  status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
  approval_by INT UNSIGNED,
  approval_date DATETIME,
  rejection_reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
  FOREIGN KEY (approval_by) REFERENCES employees(employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Absences Table
CREATE TABLE absences (
  absence_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  employee_id INT UNSIGNED NOT NULL,
  absence_date DATE NOT NULL,
  duration_hours DECIMAL(5, 2),
  reason VARCHAR(255),
  status ENUM('present', 'absent', 'late', 'justified_absence') DEFAULT 'absent',
  justification_document VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
  UNIQUE KEY uk_absence (employee_id, absence_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Recruitment - Job Openings Table
CREATE TABLE job_openings (
  job_opening_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  job_title VARCHAR(100) NOT NULL,
  department_id INT UNSIGNED NOT NULL,
  position_count INT NOT NULL DEFAULT 1,
  required_experience INT DEFAULT 0,
  required_qualifications TEXT,
  salary_min DECIMAL(10, 2),
  salary_max DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'TND',
  status ENUM('open', 'closed', 'on_hold') DEFAULT 'open',
  created_date DATE NOT NULL,
  closing_date DATE,
  created_by INT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(department_id),
  FOREIGN KEY (created_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Candidates Table
CREATE TABLE candidates (
  candidate_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  job_opening_id INT UNSIGNED NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  cv_path VARCHAR(255),
  cover_letter TEXT,
  experience_years INT DEFAULT 0,
  current_position VARCHAR(100),
  current_company VARCHAR(100),
  application_date DATE NOT NULL,
  status ENUM('submitted', 'reviewed', 'interview', 'offered', 'rejected', 'hired') DEFAULT 'submitted',
  interview_date DATETIME,
  feedback TEXT,
  rating INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_opening_id) REFERENCES job_openings(job_opening_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert sample regions
INSERT INTO regions (region_id, region_name) VALUES 
(1, 'Europe'),
(2, 'Americas'),
(3, 'Asia'),
(4, 'Africa');

-- Insert Tunisia as a country
INSERT INTO countries (country_id, country_name, region_id) VALUES 
('TN', 'Tunisia', 4);

-- Insert a location in Tunis
INSERT INTO locations (street_address, postal_code, city, state_province, country_id) VALUES 
('123 Rue de la Liberté', '1000', 'Tunis', 'Tunis', 'TN');

-- Insert departments
INSERT INTO departments (department_id, department_name, location_id) VALUES 
(1, 'Ressources Humaines', 1),
(2, 'Informatique', 1),
(3, 'Finances', 1),
(4, 'Ventes', 1),
(5, 'Opérations', 1);

-- Insert jobs
INSERT INTO jobs (job_id, job_title, min_salary, max_salary) VALUES 
('IT_PROG', 'Programmeur', 2000, 3500),
('IT_MGR', 'Gestionnaire IT', 3500, 5000),
('HR_SPEC', 'Spécialiste RH', 2200, 3200),
('FIN_ACC', 'Comptable', 2000, 3000),
('SAL_REP', 'Représentant Ventes', 1800, 3000),
('OP_MGR', 'Gestionnaire Opérations', 2500, 4000);

-- Insert admin user (password: admin123 - stored as plain text)
INSERT INTO users (email, password_hash, role, is_active) VALUES 
('admin@hrplatform.tn', 'admin123', 'admin', TRUE);

-- Insert sample employees
INSERT INTO employees (first_name, last_name, email, phone_number, hire_date, job_id, salary, department_id, user_id, cin, birth_date, nationality, contract_type, contract_start) VALUES 
('Mohamed', 'Ben Ali', 'm.benali@hrplatform.tn', '+216 95 123 456', '2022-01-15', 'IT_PROG', 2500.00, 2, 2, '12345678', '1990-05-20', 'Tunisienne', 'CDI', '2022-01-15'),
('Fatima', 'Khaled', 'f.khaled@hrplatform.tn', '+216 98 765 432', '2021-06-01', 'HR_SPEC', 2800.00, 1, 3, '87654321', '1988-03-10', 'Tunisienne', 'CDI', '2021-06-01'),
('Ahmed', 'Samir', 'a.samir@hrplatform.tn', '+216 92 456 789', '2023-03-20', 'FIN_ACC', 2300.00, 3, 4, '55555555', '1995-07-15', 'Tunisienne', 'CDI', '2023-03-20');
