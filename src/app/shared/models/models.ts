// Shared models for the HR Platform (align with backend/database/redesign_init.sql and backend/api/openapi.yaml)
export interface User { user_id:number; email:string; role:'admin'|'employee'|'manager'; is_active:boolean }
export interface Employee { employee_id:number; user_id?:number; first_name:string; last_name:string; email:string; phone_number?:string; hire_date:string; job_id:string; department_id?:number; cin?:string; birth_date?:string; nationality?:string; address?:string; city?:string; postal_code?:string; contract_type:'CDI'|'CDD'|'Stage'; contract_start?:string; contract_end?:string; base_salary:number; currency:'TND' }
export interface Contract { contract_id:number; employee_id:number; type:'CDI'|'CDD'|'Stage'; start_date:string; end_date?:string; salary:number; currency:'TND'; status:'active'|'ended' }
export interface PayrollRun { run_id:number; month:number; year:number; status:'pending'|'calculated'|'validated'|'paid'; created_at?:string }
export interface PayrollItem { item_id:number; run_id:number; employee_id:number; base_salary:number; allowances:number; deductions:number; taxes:number; net_salary:number; notes?:string }
export interface LeaveBalance { balance_id:number; employee_id:number; annual_entitlement:number; carried_over:number; year:number }
export interface Leave { leave_id:number; employee_id:number; leave_type:'annual'|'sick'|'unpaid'|'maternity'|'special'; start_date:string; end_date:string; reason?:string; status:'pending'|'approved'|'rejected'|'cancelled'; approval_by?:number; approval_date?:string; rejection_reason?:string }
export interface Absence { absence_id:number; employee_id:number; absence_date:string; duration_hours?:number; reason?:string; status:'present'|'absent'|'late'|'justified_absence'; justification_document?:string }
export interface JobOpening { job_opening_id:number; job_title:string; department_id:number; position_count:number; required_experience?:number; required_qualifications?:string; salary_min?:number; salary_max?:number; currency:'TND'; status:'open'|'closed'|'on_hold'; created_date:string; closing_date?:string; created_by?:number }
export interface Candidate { candidate_id:number; job_opening_id:number; first_name:string; last_name:string; email:string; phone?:string; cv_path?:string; cover_letter?:string; experience_years?:number; current_position?:string; current_company?:string; application_date:string; status:'submitted'|'reviewed'|'interview'|'offered'|'rejected'|'hired'; interview_date?:string; feedback?:string; rating?:number }
export interface Notification { notification_id:number; user_id:number; type:string; message:string; is_read:boolean; created_at:string }
export interface AuditLog { audit_id:number; user_id?:number; action:string; entity:string; entity_id:string; payload?:any; created_at:string }
export interface AuthResponse { token:string; user:User & { employee?:Employee|null } }
export interface LoginRequest { email:string; password:string }
