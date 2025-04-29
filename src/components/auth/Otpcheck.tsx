import { ChangeEvent, FormEvent, KeyboardEvent, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Otpcheck = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '']);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || ''; // Get email from login page

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value entered
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
    setMessage('');
    setMessageType('');

    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 5) {
      setMessage('Please enter a 5-digit OTP.');
      setMessageType('error');
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

      setMessage('OTP verified successfully!');
      setMessageType('success');

      // Store token (replace with your auth mechanism, e.g., localStorage)
      localStorage.setItem('token', data.token);

      // Redirect to a protected page (e.g., dashboard)
      setTimeout(() => {
        navigate('/dashboard'); // Adjust to your protected route
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'OTP verification failed. Please try again.');
      setMessageType('error');
    }
  };

  const handleResend = async () => {
    setMessage('');
    setMessageType('');

    try {
      const res = await fetch('http://localhost:5297/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: '' }), // Password not needed for resend
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend OTP.');
      }

      setMessage('New OTP sent to your email.');
      setMessageType('success');
      setOtp(['', '', '', '', '']); // Clear OTP inputs
      inputRefs.current[0]?.focus(); // Focus first input
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Failed to resend OTP. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Enter OTP Code
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a 5-digit code to your email
        </p>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        {message && (
          <div
            className={`p-3 rounded text-sm text-center mb-4 ${
              messageType === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="my-4 flex items-center justify-center gap-2">
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
                className="w-12 h-12 rounded-md border outline-1 outline-gray-300 text-center text-lg text-gray-900 placeholder-gray-400 focus:outline-2 focus:outline-indigo-600"
              />
            ))}
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Verify Code
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Didn't receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default Otpcheck;