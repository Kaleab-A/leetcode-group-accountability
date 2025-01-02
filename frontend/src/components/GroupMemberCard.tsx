import React from 'react';
import WeeklyCalendar from './WeeklyCalendar';

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
    <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
      <h3>{username}</h3>
      <p>Total Solved: {totalSolved}</p>
      <p>Acceptance Rate: {acceptanceRate.toFixed(2)}%</p>
      <p>Ranking: {ranking}</p>

      <WeeklyCalendar submissionCalendar={submissionCalendar} />
    </div>
  );
};

export default GroupMemberCard;
