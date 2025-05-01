import React, { useState, useRef } from 'react';
import PasswordMatchInput, { PasswordMatchInputRef } from './PasswordMatchInput';
import { Link } from 'react-router-dom';
import image from '../../assets/favicon.svg';

const Signup = () => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  
  const passwordInputRef = useRef<PasswordMatchInputRef>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const passwords = passwordInputRef.current?.getPasswords();
    
    fetch('http://localhost:5297/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password: passwords?.password,
        confirmPassword: passwords?.confirmPassword,
        role,
        organization: role === 'manager' ? organizationName : null,
        status: role === 'manager' ? 'pending' : 'approved'
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Registration failed');
        return res.json();
      })
      .then((data) => {
        console.log('User registered:', data);
        setMessage('Registration successful!');
        setMessageType('success');
        
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('Registration failed. Please try again.');
        setMessageType('error');
      });
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <img alt="Your Company" src={image} className="mx-auto h-10 w-auto" />
      <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

      {message && (
  <div
    className={`p-3 rounded text-sm text-center mb-4 ${
      messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}
  >
    {message}
  </div>
)}
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto p-4">
    
      <div className="flex gap-2">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          className="border rounded p-2 w-1/2 focus:outline-indigo-600"
          required
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          className="border rounded p-2 w-1/2 focus:outline-indigo-600"
          required
        />
      </div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border rounded p-2 w-full focus:outline-indigo-600"
        required
        autoComplete="email"
      />
      <PasswordMatchInput ref={passwordInputRef} />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border rounded p-2 w-full focus:outline-indigo-600"
        required
      >
        <option value="">Select role</option>
        <option value="client">Client</option>
        <option value="manager">Manager</option>
      </select>
      {role === 'manager' && (
        <input
          type="text"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          placeholder="Organization Name"
          className="border rounded p-2 w-full focus:outline-indigo-600"
          required
        />
      )}


      <button
        type="submit"
        className="btn-univ flex items-center justify-center gap-2"
        
      >
        Sign Up
      </button>

      <div className="text-center text-sm mt-4">
          <span className="text-gray-600">Already have an account? </span>
          <Link
            to="/Login"
            className="text-blue-500 hover:underline font-medium"
          >
            Login
          </Link>
          </div>
    </form>
    </div>
    </div>
  );
};

export default Signup;
