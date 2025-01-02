import React, { useState } from 'react';
import { createGroup } from '../services/groupService';
import { useNavigate } from 'react-router-dom';

const CreateGroup: React.FC = () => {
  const [groupName, setGroupName] = useState('');
  const navigate = useNavigate();

  const handleCreateGroup = async () => {
    try {
      const result = await createGroup(groupName);
      const newGroupID = result.groupID;
      // Store the groupID locally
      localStorage.setItem('groupID', newGroupID);
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Error creating group');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Create a Group</h1>
      <div>
        <label>Group Name: </label>
        <input
          type="text"
          placeholder="Enter a group name..."
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </div>
      <button onClick={handleCreateGroup} style={{ marginTop: '1rem' }}>
        Create
      </button>
    </div>
  );
};

export default CreateGroup;
