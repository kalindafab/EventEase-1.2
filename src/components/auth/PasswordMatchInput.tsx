import { useState, useRef, forwardRef, useImperativeHandle } from 'react';

export interface PasswordMatchInputRef {
  getPasswords: () => { password: string; confirmPassword: string };
}

const PasswordMatchInput = forwardRef<PasswordMatchInputRef>((_, ref) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  useImperativeHandle(ref, () => ({
    getPasswords: () => ({ password, confirmPassword }),
  }));

  const getMatchStatus = () => {
    return password.split('').map((char, index) => {
      if (index < confirmPassword.length) {
        return char === confirmPassword[index];
      }
      return null;
    });
  };

  return (
    <div className="space-y-4">
      {/* Password Field */}
      <div
        className="relative border dark:border-gray-600 rounded p-2 h-10 flex items-center cursor-text bg-white dark:bg-gray-700"
        onClick={() => passwordRef.current?.focus()}
      >
        <input
          ref={passwordRef}
          type="password"
          value={password}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          onChange={(e) => setPassword(e.target.value)}
          className="absolute opacity-0 top-0 left-0 w-full h-full cursor-text"
          placeholder="Enter password"
        />
        <div className="flex items-center">
          {(password.length > 0 || passwordFocused) ? (
            getMatchStatus().map((isMatch, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full mx-1 
                  ${isMatch === true ? 'bg-green-500' : 
                    isMatch === false ? 'bg-red-500' : 'bg-black dark:bg-white'}`}
              />
            ))
          ) : (
            <span className="text-gray-400 dark:text-gray-300">Enter password</span>
          )}
        </div>
      </div>

      {/* Confirm Password Field */}
      <div
        className="relative border dark:border-gray-600 rounded p-2 h-10 flex items-center cursor-text bg-white dark:bg-gray-700"
        onClick={() => confirmRef.current?.focus()}
      >
        <input
          ref={confirmRef}
          type="password"
          value={confirmPassword}
          onFocus={() => setConfirmFocused(true)}
          onBlur={() => setConfirmFocused(false)}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="absolute opacity-0 top-0 left-0 w-full h-full cursor-text"
          placeholder="Confirm password"
        />
        <div className="flex items-center">
          {(confirmPassword.length > 0 || confirmFocused) ? (
            confirmPassword.split('').map((_, index) => (
              <div key={index} className="w-2 h-2 rounded-full mx-1 bg-black dark:bg-white" />
            ))
          ) : (
            <span className="text-gray-400 dark:text-gray-300">Confirm password</span>
          )}
        </div>
      </div>
    </div>
  );
});

export default PasswordMatchInput;