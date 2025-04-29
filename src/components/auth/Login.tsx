import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image from '../../../public/favicon.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    try {
      const res = await fetch('http://localhost:5297/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await res.json();
      console.log('Login successful:', data);
      setMessage(data.message || 'OTP sent to your email.');
      setMessageType('success');

      // Redirect after short delay to OTP screen
      setTimeout(() => {
        navigate('/otpchecking', { state: { email } });
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Login failed. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <img alt="Your Company" src={image} className="mx-auto h-10 w-auto" />
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

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

        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto p-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border rounded p-2 w-full focus:outline-indigo-600"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border rounded p-2 w-full focus:outline-indigo-600"
            required
          />

          <button
            type="submit"
            className="btn-primary flex items-center justify-center gap-2 w-full py-2 rounded mt-4"
          >
            Login
          </button>

          <div className="text-right text-sm mt-2">
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="text-center text-sm mt-4">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/signup" className="text-blue-500 hover:underline font-medium">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
