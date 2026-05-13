import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        navigate('/home');
      } else {
        const data = await signup(email, password);
        // Supabase may require email confirmation depending on project settings.
        // If email confirmation is disabled, the user is signed in immediately.
        if (data.session) {
          navigate('/home');
        } else {
          setMessage('Account created! Please check your email to confirm your account before logging in.');
        }
      }
    } catch (error) {
      setMessage(`Error: ${error.message || 'Something went wrong'}`);
    } finally {
      setIsLoading(false);
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
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        {message && <p>{message}</p>}
        <button className="toggle-btn" onClick={() => { setIsLogin(!isLogin); setMessage(''); }}>
          {isLogin ? 'Create an account' : 'Already have an account?'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
