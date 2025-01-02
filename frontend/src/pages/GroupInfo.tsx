import React, { useState, useEffect } from 'react';
import { getGroup, removeUser } from '../services/groupService';

const GroupInfo: React.FC = () => {
  const [groupData, setGroupData] = useState<any>(null);
  const groupID = localStorage.getItem('groupID') || '';

  useEffect(() => {
    if (groupID) {
      handleLoadGroup();
    }
    // eslint-disable-next-line
  }, [groupID]);

  const handleLoadGroup = async () => {
    try {
      const data = await getGroup(groupID);
      setGroupData(data);
    } catch (error) {
      console.error(error);
      alert('Error loading group info');
    }
  };

  const handleRemoveUser = async (username: string) => {
    try {
      await removeUser(groupID, username);
      alert(`Removed ${username}`);
      // Reload group data
      handleLoadGroup();
    } catch (error) {
      console.error(error);
      alert('Error removing user');
    }
  };

  return (
    <div className="main-content">
      <h1 className="group-info-title">Group Info</h1>
  
      {groupData && (
        <>
          <h2 className="group-info-header">
            {groupData.groupName} (ID: <span className="group-id">{groupData.groupID}</span>)
          </h2>
          <ul className="members-list">
            {groupData.members.map((m: any) => (
              <li key={m.username} className="member-item">
                <span className="member-name">{m.username}</span>
                <button
                  className="remove-button"
                  onClick={() => handleRemoveUser(m.username)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default GroupInfo;
