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
    <div style={{ padding: '1rem' }}>
      <h1>Dashboard</h1>

      {groupData && (
        <div>
          <h2>
            {groupData.groupName} (ID: {groupData.groupID})
          </h2>
          <button onClick={handleRefreshStats}>Refresh Stats</button>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
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
