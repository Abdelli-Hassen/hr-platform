-- Update admin password to admin123 (properly hashed)
-- Run this SQL query in your MySQL database to fix the admin password

UPDATE users 
SET password_hash = '$2b$10$KqE7ZAiSx7CsYYlO/LfiZeFVBBX3VG//Nr6xAchZMdgqXWUkuzyYO' 
WHERE email = 'admin@hrplatform.tn';

-- Verify the update
SELECT email, role, LEFT(password_hash, 20) as password_hash_preview FROM users WHERE email = 'admin@hrplatform.tn';

