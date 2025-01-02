import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SetGroupIDAndRedirect: React.FC = () => {
  const { groupID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (groupID) {
      localStorage.setItem('groupID', groupID);
      // Then redirect to the dashboard
      navigate('/dashboard', { replace: true });
    } else {
      // If no groupID param, just go to create page or handle error
      navigate('/creategroup', { replace: true });
    }
  }, [groupID, navigate]);

  return null;
};

export default SetGroupIDAndRedirect;
