import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const groupID = localStorage.getItem('groupID');

  if (!groupID) {
    // Not joined or created a group yet
    return <Navigate to="/creategroup" replace />;
  }

  // If groupID is present, render the protected route
  return <>{children}</>;
};

export default PrivateRoute;
