-- HR Platform Redesign Schema (Tunisia, TND)
DROP SCHEMA IF EXISTS human_ressources;
CREATE SCHEMA human_ressources COLLATE utf8mb4_general_ci;
USE human_ressources;

-- Core
CREATE TABLE users (
  user_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','employee','manager') NOT NULL DEFAULT 'employee',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE departments (
  department_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE jobs (
  job_id VARCHAR(12) NOT NULL PRIMARY KEY,
  job_title VARCHAR(60) NOT NULL,
  min_salary DECIMAL(10,2) UNSIGNED,
  max_salary DECIMAL(10,2) UNSIGNED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE employees (
  employee_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone_number VARCHAR(20),
  hire_date DATE NOT NULL,
  job_id VARCHAR(12) NOT NULL,
  department_id INT UNSIGNED,
  cin VARCHAR(20),
  birth_date DATE,
  nationality VARCHAR(50) DEFAULT 'Tunisienne',
  address VARCHAR(255),
  city VARCHAR(50),
  postal_code VARCHAR(10),
  contract_type ENUM('CDI','CDD','Stage') NOT NULL DEFAULT 'CDI',
  contract_start DATE,
  contract_end DATE,
  base_salary DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'TND',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_emp_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_emp_job FOREIGN KEY (job_id) REFERENCES jobs(job_id),
  CONSTRAINT fk_emp_dept FOREIGN KEY (department_id) REFERENCES departments(department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE contracts (
  contract_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  employee_id INT UNSIGNED NOT NULL,
  type ENUM('CDI','CDD','Stage') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  salary DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'TND',
  status ENUM('active','ended') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Payroll
CREATE TABLE payroll_runs (
  run_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  month INT NOT NULL,
  year INT NOT NULL,
  status ENUM('pending','calculated','validated','paid') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_run (month, year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE payroll_items (
  item_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  run_id INT UNSIGNED NOT NULL,
  employee_id INT UNSIGNED NOT NULL,
  base_salary DECIMAL(10,2) NOT NULL,
  allowances DECIMAL(10,2) DEFAULT 0,
  deductions DECIMAL(10,2) DEFAULT 0,
  taxes DECIMAL(10,2) DEFAULT 0,
  net_salary DECIMAL(10,2) NOT NULL,
  notes VARCHAR(255),
  FOREIGN KEY (run_id) REFERENCES payroll_runs(run_id),
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
  UNIQUE KEY uk_item (run_id, employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Leaves & Absences
CREATE TABLE leave_balances (
  balance_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  employee_id INT UNSIGNED NOT NULL,
  annual_entitlement DECIMAL(5,2) NOT NULL DEFAULT 30.00,
  carried_over DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  year INT NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
  UNIQUE KEY uk_balance (employee_id, year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE leaves (
  leave_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  employee_id INT UNSIGNED NOT NULL,
  leave_type ENUM('annual','sick','unpaid','maternity','special') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(255),
  status ENUM('pending','approved','rejected','cancelled') DEFAULT 'pending',
  approval_by INT UNSIGNED,
  approval_date DATETIME,
  rejection_reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
  FOREIGN KEY (approval_by) REFERENCES employees(employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE absences (
  absence_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  employee_id INT UNSIGNED NOT NULL,
  absence_date DATE NOT NULL,
  duration_hours DECIMAL(5,2),
  reason VARCHAR(255),
  status ENUM('present','absent','late','justified_absence') DEFAULT 'absent',
  justification_document VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
  UNIQUE KEY uk_absence (employee_id, absence_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Recruitment
CREATE TABLE job_openings (
  job_opening_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  job_title VARCHAR(100) NOT NULL,
  department_id INT UNSIGNED NOT NULL,
  position_count INT NOT NULL DEFAULT 1,
  required_experience INT DEFAULT 0,
  required_qualifications TEXT,
  salary_min DECIMAL(10,2),
  salary_max DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'TND',
  status ENUM('open','closed','on_hold') DEFAULT 'open',
  created_date DATE NOT NULL,
  closing_date DATE,
  created_by INT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(department_id),
  FOREIGN KEY (created_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  status ENUM('submitted','reviewed','interview','offered','rejected','hired') DEFAULT 'submitted',
  interview_date DATETIME,
  feedback TEXT,
  rating INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_opening_id) REFERENCES job_openings(job_opening_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Support
CREATE TABLE notifications (
  notification_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  type VARCHAR(40) NOT NULL,
  message VARCHAR(255) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE audit_logs (
  audit_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED,
  action VARCHAR(50) NOT NULL,
  entity VARCHAR(50) NOT NULL,
  entity_id VARCHAR(50) NOT NULL,
  payload JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed baseline (Tunisia, TND)
INSERT INTO departments (department_name) VALUES
('Ressources Humaines'), ('Informatique'), ('Finances'), ('Ventes'), ('Opérations');

INSERT INTO jobs (job_id, job_title, min_salary, max_salary) VALUES
('IT_PROG', 'Programmeur', 2000, 3500),
('IT_MGR', 'Gestionnaire IT', 3500, 5000),
('HR_SPEC', 'Spécialiste RH', 2200, 3200),
('FIN_ACC', 'Comptable', 2000, 3000),
('SAL_REP', 'Représentant Ventes', 1800, 3000),
('OP_MGR', 'Gestionnaire Opérations', 2500, 4000);

-- Admin (password: admin123 plain text to match current code; change to bcrypt in prod)
INSERT INTO users (email, password_hash, role, is_active) VALUES
('admin@hrplatform.tn', 'admin123', 'admin', TRUE);

-- Sample employee + user
INSERT INTO users (email, password_hash, role, is_active) VALUES
('m.benali@hrplatform.tn', 'benali123', 'employee', TRUE);

INSERT INTO employees (
  user_id, first_name, last_name, email, phone_number, hire_date, job_id, department_id,
  cin, birth_date, nationality, address, city, postal_code, contract_type, contract_start,
  base_salary, currency
) VALUES (
  LAST_INSERT_ID(), 'Mohamed', 'Ben Ali', 'm.benali@hrplatform.tn', '+21695123456', '2022-01-15', 'IT_PROG', 2,
  '12345678', '1990-05-20', 'Tunisienne', '123 Rue de la Liberté', 'Tunis', '1000', 'CDI', '2022-01-15',
  2500.00, 'TND'
);

INSERT INTO contracts (employee_id, type, start_date, salary, currency)
SELECT employee_id, 'CDI', contract_start, base_salary, currency FROM employees WHERE email='m.benali@hrplatform.tn';

-- Leave balances
INSERT INTO leave_balances (employee_id, annual_entitlement, carried_over, year)
SELECT employee_id, 30.00, 0.00, YEAR(CURDATE()) FROM employees;

-- Example opening and candidate
INSERT INTO job_openings (job_title, department_id, position_count, created_date, status, created_by)
VALUES ('Développeur Angular', 2, 1, CURDATE(), 'open', 1);

INSERT INTO candidates (job_opening_id, first_name, last_name, email, phone, application_date)
SELECT job_opening_id, 'Amira', 'Trabelsi', 'amira.trabelsi@example.tn', '+21698765432', CURDATE()
FROM job_openings WHERE job_title='Développeur Angular' LIMIT 1;
