import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserRound, Building2, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { TextField, SelectField, TextAreaField } from '../../components/forms/FormField';
import PasswordField from '../../components/forms/PasswordField';
import GoogleAuthButton from '../../components/common/GoogleAuthButton';
import { getErrorMessage } from '../../services/api';
import { COURSES, DEPARTMENTS } from '../../utils/constants';

const CURRENT_YEAR = new Date().getFullYear();
const GRAD_YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR + i);

const initialStudent = {
  fullName: '', email: '', password: '', studentId: '', course: '', department: '',
  semester: '', graduationYear: '', phone: '',
};

const initialRecruiter = {
  recruiterName: '', companyName: '', officialEmail: '', password: '',
  companyWebsite: '', companyDescription: '', companyLocation: '',
};

const Register = () => {
  const [searchParams] = useSearchParams();
  const { registerStudent, registerRecruiter } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState(searchParams.get('role') === 'recruiter' ? 'recruiter' : 'student');
  const [studentForm, setStudentForm] = useState(initialStudent);
  const [recruiterForm, setRecruiterForm] = useState(initialRecruiter);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateStudent = () => {
    const e = {};
    if (!studentForm.fullName.trim()) e.fullName = 'Full name is required';
    if (!studentForm.email.trim()) e.email = 'Email is required';
    if (studentForm.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!studentForm.studentId.trim()) e.studentId = 'Student ID is required';
    if (!studentForm.course) e.course = 'Course is required';
    if (!studentForm.department) e.department = 'Department is required';
    if (!studentForm.semester) e.semester = 'Semester is required';
    if (!studentForm.graduationYear) e.graduationYear = 'Graduation year is required';
    if (!studentForm.phone.trim()) e.phone = 'Phone number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateRecruiter = () => {
    const e = {};
    if (!recruiterForm.recruiterName.trim()) e.recruiterName = 'Your name is required';
    if (!recruiterForm.companyName.trim()) e.companyName = 'Company name is required';
    if (!recruiterForm.officialEmail.trim()) e.officialEmail = 'Official email is required';
    if (recruiterForm.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!recruiterForm.companyLocation.trim()) e.companyLocation = 'Company location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setErrors({});
    if (role === 'student') {
      if (!validateStudent()) return;
      setLoading(true);
      try {
        await registerStudent({ ...studentForm, semester: Number(studentForm.semester), graduationYear: Number(studentForm.graduationYear) });
        toast.success('Account created! Welcome to LJ CareerConnect.');
        navigate('/student/dashboard', { replace: true });
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    } else {
      if (!validateRecruiter()) return;
      setLoading(true);
      try {
        await registerRecruiter(recruiterForm);
        toast.success('Account created! Welcome to LJ CareerConnect.');
        navigate('/recruiter/dashboard', { replace: true });
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-ink-950">Create your account</h1>
      <p className="mt-1.5 text-sm text-ink-400">Join as a student or a recruiter to get started.</p>

      <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-ink-100 p-1">
        <button
          type="button"
          onClick={() => setRole('student')}
          className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
            role === 'student' ? 'bg-white text-ink-950 shadow-soft' : 'text-ink-500'
          }`}
        >
          <UserRound size={16} /> Student
        </button>
        <button
          type="button"
          onClick={() => setRole('recruiter')}
          className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
            role === 'recruiter' ? 'bg-white text-ink-950 shadow-soft' : 'text-ink-500'
          }`}
        >
          <Building2 size={16} /> Recruiter
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {role === 'student' ? (
          <>
            <TextField label="Full Name" required value={studentForm.fullName} error={errors.fullName}
              onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })} placeholder="Aarav Shah" />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Email" type="email" required value={studentForm.email} error={errors.email}
                onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} placeholder="you@example.com" />
              <PasswordField label="Password" name="student-password" required value={studentForm.password} error={errors.password}
                onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })} placeholder="••••••••" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Student ID" required value={studentForm.studentId} error={errors.studentId}
                onChange={(e) => setStudentForm({ ...studentForm, studentId: e.target.value })} placeholder="LJ2023XXXX" />
              <TextField label="Phone" required value={studentForm.phone} error={errors.phone}
                onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })} placeholder="9876543210" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Course" required value={studentForm.course} error={errors.course}
                onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })}>
                <option value="">Select course</option>
                {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </SelectField>
              <SelectField label="Department" required value={studentForm.department} error={errors.department}
                onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}>
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </SelectField>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Semester" required value={studentForm.semester} error={errors.semester}
                onChange={(e) => setStudentForm({ ...studentForm, semester: e.target.value })}>
                <option value="">Select semester</option>
                {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => <option key={s} value={s}>Semester {s}</option>)}
              </SelectField>
              <SelectField label="Graduation Year" required value={studentForm.graduationYear} error={errors.graduationYear}
                onChange={(e) => setStudentForm({ ...studentForm, graduationYear: e.target.value })}>
                <option value="">Select year</option>
                {GRAD_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </SelectField>
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Your Name" required value={recruiterForm.recruiterName} error={errors.recruiterName}
                onChange={(e) => setRecruiterForm({ ...recruiterForm, recruiterName: e.target.value })} placeholder="Priya Desai" />
              <TextField label="Company Name" required value={recruiterForm.companyName} error={errors.companyName}
                onChange={(e) => setRecruiterForm({ ...recruiterForm, companyName: e.target.value })} placeholder="Bluewave Softworks" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Official Email" type="email" required value={recruiterForm.officialEmail} error={errors.officialEmail}
                onChange={(e) => setRecruiterForm({ ...recruiterForm, officialEmail: e.target.value })} placeholder="hr@company.com" />
              <PasswordField label="Password" name="recruiter-password" required value={recruiterForm.password} error={errors.password}
                onChange={(e) => setRecruiterForm({ ...recruiterForm, password: e.target.value })} placeholder="••••••••" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Company Website" value={recruiterForm.companyWebsite}
                onChange={(e) => setRecruiterForm({ ...recruiterForm, companyWebsite: e.target.value })} placeholder="https://company.com" />
              <TextField label="Company Location" required value={recruiterForm.companyLocation} error={errors.companyLocation}
                onChange={(e) => setRecruiterForm({ ...recruiterForm, companyLocation: e.target.value })} placeholder="Ahmedabad, Gujarat" />
            </div>
            <TextAreaField label="Company Description" rows={3} value={recruiterForm.companyDescription}
              onChange={(e) => setRecruiterForm({ ...recruiterForm, companyDescription: e.target.value })}
              placeholder="A short description of what your company does." />
          </>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? 'Creating account...' : (<><UserPlus size={17} /> Create Account</>)}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink-100" />
        <span className="text-xs font-medium text-ink-300">OR</span>
        <div className="h-px flex-1 bg-ink-100" />
      </div>

      <GoogleAuthButton label="Continue with Google" />

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
