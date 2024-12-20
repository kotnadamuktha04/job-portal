import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import axios for making API requests
import { useAuth } from './AuthContext';
import './AuthPage.css'; // Import the CSS file

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');  // For displaying messages to users
  const { login } = useAuth();  // Custom hook for authentication
  const navigate = useNavigate();  // For navigation

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const url = isLogin ? 'http://localhost:5001/login' : 'http://localhost:5001/signup';
      const response = await axios.post(url, { email, password });
      
      console.log(response.data); // Log the response to check if the token is present
  
      if (response.data.message === 'Login successful') {
        const token = response.data.token; // Ensure your server returns a token
        login(token); // Call your login function
        console.log('Navigating to /home'); // Debugging line
        navigate('/home'); // Redirect to home page
      }
      
      setMessage(response.data.message);
    } catch (error) {
      setMessage(`Error ${isLogin ? 'logging in' : 'signing up'}: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </label>
          <label>
            Password:
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </label>
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        {message && <p>{message}</p>} 
        <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Create an account' : 'Already have an account?'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
