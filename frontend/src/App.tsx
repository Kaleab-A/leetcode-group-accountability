import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CreateGroup from './pages/CreateGroup';
import JoinGroup from './pages/JoinGroup';
import Dashboard from './pages/Dashboard';
import GroupInfo from './pages/GroupInfo';
import PrivateRoute from './routes/PrivateRoute';
import SetGroupIDAndRedirect from './routes/SetGroupIDAndRedirect';
import './App.css';

function App() {
  return (
    <div>
      {/* Simple nav just for demonstration */}
      <nav style={{ margin: '1rem' }}>
        <Link to="/creategroup">Create Group</Link> |{' '}
        <Link to="/joingroup">Join Group</Link> |{' '}
        <Link to="/dashboard">Dashboard</Link> |{' '}
        <Link to="/groupinfo">Group Info</Link>
      </nav>

      <Routes>
        {/* 1) Separate pages for creating and joining a group */}
        <Route path="/creategroup" element={<CreateGroup />} />
        <Route path="/joingroup" element={<JoinGroup />} />

        {/* 2) If user visits /group/<groupID>, store that ID in localStorage and redirect to /dashboard */}
        <Route path="/group/:groupID" element={<SetGroupIDAndRedirect />} />

        {/* 3) Protected routes: user must have groupID to access */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/groupinfo"
          element={
            <PrivateRoute>
              <GroupInfo />
            </PrivateRoute>
          }
        />

        {/* Default route - optional redirect or landing */}
        <Route path="*" element={<CreateGroup />} />
      </Routes>
    </div>
  );
}

export default App;
