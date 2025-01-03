import React from 'react';
import WeeklyCalendar from './WeeklyCalendar';
import StreakCounter from './StreakCounter';

interface MemberProps {
  member: {
    username: string;
    totalSolved: number;
    acceptanceRate: number;
    ranking: number;
    submissionCalendar: Record<string, number>;
  };
}
const GroupMemberCard: React.FC<MemberProps> = ({ member }) => {
  const { username, totalSolved, acceptanceRate, ranking, submissionCalendar } = member;

  return (
    <div className="card">
    <div className="card-header">
      <div className="card-content">
        <h3 className="card-title">{username}</h3>
        <p>Total Solved: <span className="card-highlight">{totalSolved}</span></p>
        <p>Acceptance Rate: <span className="card-highlight">{acceptanceRate.toFixed(2)}%</span></p>
        <p>Ranking: <span className="card-highlight">{ranking}</span></p>
      </div>
  
      <StreakCounter submissionCalendar={submissionCalendar} />
    </div>
  
    <WeeklyCalendar submissionCalendar={submissionCalendar} />
  </div>
  
  );
};
export default GroupMemberCard;
