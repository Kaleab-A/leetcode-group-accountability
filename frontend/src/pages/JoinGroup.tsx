import React, { useState } from 'react';
import { joinGroup } from '../services/groupService';
import { useNavigate } from 'react-router-dom';

const JoinGroup: React.FC = () => {
  const [groupID, setGroupID] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleJoinGroup = async () => {
    if (!groupID || !username) {
      alert('Please provide groupID and username');
      return;
    }
    try {
      await joinGroup(groupID, username);
      // Store the groupID locally
      localStorage.setItem('groupID', groupID);
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Error joining group');
    }
  };

  return (
    <div style={{ padding: '1rem' }} className="main-content">
      <h1>Join a Group</h1>
      <div>
        <label>Group ID: </label>
        <input
          type="text"
          value={groupID}
          onChange={(e) => setGroupID(e.target.value)}
          placeholder="Enter the group ID..."
        />
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <label>Leetcode Username: </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your LeetCode username..."
        />
      </div>

      <button onClick={handleJoinGroup} style={{ marginTop: '1rem' }}>
        Join
      </button>
    </div>
  );
};

export default JoinGroup;
