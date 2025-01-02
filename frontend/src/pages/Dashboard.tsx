import React, { useState, useEffect } from 'react';
import { getGroup, refreshGroupStats } from '../services/groupService';
import GroupMemberCard from '../components/GroupMemberCard';

const Dashboard: React.FC = () => {
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
      alert('Error loading group data');
    }
  };

  const handleRefreshStats = async () => {
    try {
      await refreshGroupStats(groupID);
      // Re-fetch the updated data
      handleLoadGroup();
    } catch (error) {
      console.error(error);
      alert('Error refreshing stats');
    }
  };

  return (
    <div className="main-content">
      <h1 className="dashboard-title">Dashboard</h1>
  
      {groupData && (
        <div className="dashboard-content">
          <h2 className="group-info">
            {groupData.groupName} (ID: {groupData.groupID})
          </h2>
          <button className="refresh-button" onClick={handleRefreshStats}>
            Refresh Stats
          </button>
          <div className="members-container">
            {groupData.members.map((member: any) => (
              <GroupMemberCard key={member.username} member={member} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
