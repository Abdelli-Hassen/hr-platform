-- Update admin password to admin123 (plain text - no hashing)
-- Run this SQL query in your MySQL database to set the admin password

UPDATE users 
SET password_hash = 'admin123' 
WHERE email = 'admin@hrplatform.tn';

-- Verify the update
SELECT email, role, password_hash FROM users WHERE email = 'admin@hrplatform.tn';

