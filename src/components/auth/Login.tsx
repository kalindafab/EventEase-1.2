import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  //to dempostrate the login functionality, we will just log the email and password to the console.
  const handlesignin = () => {
    navigate("/otpchecking");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    //  replace this with  login API
    console.log({ email, password });

    // Here you can validate or send to API
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
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
            onClick={handlesignin}
          >
            Login
          </button>

         
          <div className="text-center text-sm mt-4">
            <span className="text-gray-600">Don't have an account? </span>
            <Link
              to="/signup"
              className="text-blue-500 hover:underline font-medium"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
