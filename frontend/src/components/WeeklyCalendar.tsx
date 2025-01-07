import React from 'react';

interface CalendarProps {
  // The API returns an object whose keys are Unix timestamps (in seconds), values are submission counts
  submissionCalendar: Record<string, number>;
}

const WeeklyCalendar: React.FC<CalendarProps> = ({ submissionCalendar }) => {
  // STEP 1: Normalize the raw timestamps to the start-of-day in GMT.
  const dailyCounts = React.useMemo(() => {
    const normalized: Record<number, number> = {};

    // submissionCalendar keys are strings, convert them to numbers
    Object.entries(submissionCalendar).forEach(([rawTs, submissions]) => {
      const tsMs = Number(rawTs) * 1000; // Convert seconds → milliseconds
      const dateObj = new Date(tsMs);
      // “Floor” the date to midnight in GMT
      dateObj.setUTCHours(0, 0, 0, 0);
      const dayStartTs = Math.floor(dateObj.getTime() / 1000); // convert back to seconds

      // Accumulate submissions into that day
      if (!normalized[dayStartTs]) {
        normalized[dayStartTs] = 0;
      }
      normalized[dayStartTs] += submissions;
    });

    return normalized;
  }, [submissionCalendar]);

  // STEP 2: Get an array of the last 7 days (in seconds since epoch at midnight in GMT).
  const last7Days = React.useMemo(() => {
    const result: number[] = [];

    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const dayStartTs = Math.floor(now.getTime() / 1000);
      // Add to front or back depending on how you want to display
      result.unshift(dayStartTs);

      // Go to the previous day
      now.setUTCDate(now.getUTCDate() - 1);
    }

    return result;
  }, [submissionCalendar]);

  // STEP 3: For each of the last 7 days, check if dailyCounts > 0 and display accordingly.
  return (
    <div className="weekly-calendar">
      {last7Days.map((dayTs, index) => {
        const submissionCount = dailyCounts[dayTs] || 0;
        const date = new Date(dayTs * 1000);
        const monthName = date.toLocaleString('default', { month: 'short', timeZone: 'UTC' });
        const day = date.getUTCDate();
        const dateStringUpdated = `${monthName} ${day}`;

        // Check for missed submissions and determine if ice icon should be used
        const previousSubmissionCount = index > 0 ? dailyCounts[last7Days[index - 1]] || 0 : 0;
        const isMiss = submissionCount === 0 && previousSubmissionCount > 0;

        return (
          <div key={dayTs} className="day">
            <div className="check">
              {submissionCount > 0 ? '✅' : isMiss ? '🧊' : '❌'}
            </div>
            <small className="day-date">{dateStringUpdated}</small>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyCalendar;
