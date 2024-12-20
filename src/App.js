import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Jobs from './components/Jobs';
import PostJob from './components/PostJob';
import SaveJobs from './components/SaveJobs';
import Discussion from './components/Discussion';
import ApplyJobs from './components/ApplyJobs';
import AuthPage from './AuthPage';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="*" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/apply-jobs" element={<ApplyJobs />} />
          <Route path="/saved-job" element={<SaveJobs />} />
          <Route path="/discussion" element={<Discussion />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;