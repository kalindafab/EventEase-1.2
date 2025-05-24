import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Otpcheck = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '']);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const { login } = useAuth();

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 4 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setMessageType('');

    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 5) {
      setMessage('Please enter a 5-digit OTP.');
      setMessageType('error');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5297/api/users/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid or expired OTP.');
      }

      // Extract from nested `token` object
      const tokenData = data.token;

      const userData = {
        id: tokenData.id,
        firstname: tokenData.firstname,
        lastname: tokenData.lastname,
        email: tokenData.email,
        role: tokenData.role,
        status: tokenData.status,
        organization:tokenData.organization,
        permissions: tokenData.permissions,
        tokenExpiresAt: Date.now() + tokenData.expiresIn * 1000,
      };

      login(userData, tokenData.token);
      toast.success('OTP verified successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setMessage(err.message || 'OTP verification failed. Please try again.');
      setMessageType('error');
      toast.error(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const res = await fetch('http://localhost:5297/api/users/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend OTP.');
      }

      setMessage('New OTP sent to your email.');
      setMessageType('success');
      setOtp(['', '', '', '', '']);
      inputRefs.current[0]?.focus();
      toast.success('New OTP sent!');
    } catch (err: any) {
      console.error('Resend OTP error:', err);
      setMessage(err.message || 'Failed to resend OTP. Please try again.');
      setMessageType('error');
      toast.error(err.message || 'Resend failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white dark:bg-gray-900 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          Verify Your Identity
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          We've sent a 5-digit code to {email || 'your email'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        {message && (
          <div
            className={`p-3 rounded-md mb-4 text-center text-sm ${
              messageType === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="h-14 w-14 text-center text-xl font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500"
                autoFocus={index === 0}
                disabled={isLoading}
              />
            ))}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex w-full justify-center rounded-md px-3 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors ${
                isLoading
                  ? 'bg-indigo-400 dark:bg-indigo-500 cursor-not-allowed'
                  : 'bg-indigo-600 dark:bg-indigo-600 hover:bg-indigo-500 dark:hover:bg-indigo-500 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400'
              }`}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 disabled:text-indigo-300 dark:disabled:text-indigo-600 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Sending...' : 'Resend OTP'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Otpcheck;