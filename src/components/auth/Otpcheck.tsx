import { ChangeEvent, FormEvent, KeyboardEvent, useRef, useState } from "react";

const Otpcheck = () => {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
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
  
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const enteredOtp = otp.join('');
      console.log('Submitted OTP:', enteredOtp);
      // You can now send enteredOtp to your server
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
            <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Resend
            </button>
          </p>
        </div>
      </div>
    );
  };

export default Otpcheck
