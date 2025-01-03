import React from 'react';

interface CalendarProps {
  submissionCalendar: Record<string, number>;
}

const StreakCounter: React.FC<CalendarProps> = ({ submissionCalendar }) => {
  const currentStreak = React.useMemo(() => {
    const dailyCounts: Record<number, number> = {};
    Object.entries(submissionCalendar).forEach(([rawTs, submissions]) => {
      const tsMs = Number(rawTs) * 1000;
      const dateObj = new Date(tsMs);
      dateObj.setUTCHours(0, 0, 0, 0);
      const dayStartTs = Math.floor(dateObj.getTime() / 1000);
      dailyCounts[dayStartTs] = (dailyCounts[dayStartTs] || 0) + submissions;
    });

    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    let streak = 0;

    while (true) {
      const currentDayTs = Math.floor(now.getTime() / 1000);
      if (dailyCounts[currentDayTs] && dailyCounts[currentDayTs] > 0) {
        streak += 1;
      } else {
        break;
      }
      now.setUTCDate(now.getUTCDate() - 1);
    }

    return streak;
  }, [submissionCalendar]);

  return (
    <div className={`streak-counter ${currentStreak > 0 ? 'active' : 'inactive'}`}>
      <div className="streak-content">
        <svg
          className="fire-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill={currentStreak > 0 ? '#ff4500' : '#ccc'}
          height="24px"
          width="24px"
          viewBox="0 0 800 800"
        >
          <g>
            <path d="M216.02,611.195c5.978,3.178,12.284-3.704,8.624-9.4c-19.866-30.919-38.678-82.947-8.706-149.952   c49.982-111.737,80.396-169.609,80.396-169.609s16.177,67.536,60.029,127.585c42.205,57.793,65.306,130.478,28.064,191.029   c-3.495,5.683,2.668,12.388,8.607,9.349c46.1-23.582,97.806-70.885,103.64-165.017c2.151-28.764-1.075-69.034-17.206-119.851   c-20.741-64.406-46.239-94.459-60.992-107.365c-4.413-3.861-11.276-0.439-10.914,5.413c4.299,69.494-21.845,87.129-36.726,47.386   c-5.943-15.874-9.409-43.33-9.409-76.766c0-55.665-16.15-112.967-51.755-159.531c-9.259-12.109-20.093-23.424-32.523-33.073   c-4.5-3.494-11.023,0.018-10.611,5.7c2.734,37.736,0.257,145.885-94.624,275.089c-86.029,119.851-52.693,211.896-40.864,236.826   C153.666,566.767,185.212,594.814,216.02,611.195z" />
          </g>
        </svg>
        <p><b>{currentStreak} day{currentStreak !== 1 ? 's' : ''} </b></p>
      </div>
    </div>
  );
};

export default StreakCounter;
