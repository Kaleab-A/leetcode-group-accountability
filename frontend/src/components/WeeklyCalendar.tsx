import React from 'react';

interface CalendarProps {
  // The API returns an object whose keys are Unix timestamps (in seconds), values are submission counts
  submissionCalendar: Record<string, number>;
}

const WeeklyCalendar: React.FC<CalendarProps> = ({ submissionCalendar }) => {
  // STEP 1: Normalize the raw timestamps to the start-of-day so that each day has a summed submission count.
  const dailyCounts = React.useMemo(() => {
    const normalized: Record<number, number> = {};

    // submissionCalendar keys are strings, convert them to numbers
    Object.entries(submissionCalendar).forEach(([rawTs, submissions]) => {
      const tsMs = Number(rawTs) * 1000; // Convert seconds → milliseconds
      const dateObj = new Date(tsMs);
      // “Floor” the date to midnight
      dateObj.setHours(0, 0, 0, 0);
      const dayStartTs = Math.floor(dateObj.getTime() / 1000); // convert back to seconds

      // Accumulate submissions into that day
      if (!normalized[dayStartTs]) {
        normalized[dayStartTs] = 0;
      }
      normalized[dayStartTs] += submissions;
    });

    return normalized;
  }, [submissionCalendar]);

  // STEP 2: Get an array of the last 7 days (in seconds since epoch at midnight).
  const last7Days = React.useMemo(() => {
    const result: number[] = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0); // set to midnight

    for (let i = 0; i < 7; i++) {
      const dayStartTs = Math.floor(now.getTime() / 1000);
      // add to front or back depending on how you want to display
      result.unshift(dayStartTs);

      // go to the previous day
      now.setDate(now.getDate() - 1);
    }

    return result;
  }, []);

  // STEP 3: For each of the last 7 days, check if dailyCounts > 0 and display accordingly.
  return (
    <div className="weekly-calendar">
      {last7Days.map((dayTs) => {
        const submissionCount = dailyCounts[dayTs] || 0;
        const dateString = new Date(dayTs * 1000).toLocaleDateString();

        // Instead of 1/1/2025, display Jan 1
        const [month, day] = dateString.split('/');
        const monthName = new Date(dayTs * 1000).toLocaleString('default', { month: 'short' });
        const dateStringUpdated = `${monthName} ${day}`;
  
        return (
          <div key={dayTs} className="day">
            <div className="check">{submissionCount > 0 ? '✅' : '❌'}</div>
            <small className="day-date">{dateStringUpdated}</small>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyCalendar;
