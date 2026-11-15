import API from "./api";

// Get calendar events for a selected period
export const getCalendarEvents = async (startDate, endDate) => {
  const response = await API.get("/reminders/calendar", {
    params: {
      start_date: startDate,
      end_date: endDate
    }
  });

  return response.data;
};

// Get events for a particular date
export const getEventsByDate = async (date) => {
  const response = await API.get("/reminders/calendar/day", {
    params: { date }
  });

  return response.data;
};

// Get upcoming document expirations
export const getUpcomingExpirations = async (days = 30) => {
  const response = await API.get("/documents/expiring", {
    params: { days }
  });

  return response.data;
};

// Get expired documents
export const getExpiredDocuments = async () => {
  const response = await API.get("/documents/expired");
  return response.data;
};

export default {
  getCalendarEvents,
  getEventsByDate,
  getUpcomingExpirations,
  getExpiredDocuments
};