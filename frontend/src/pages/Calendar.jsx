import React, { useEffect, useState } from "react";
import { getDocuments } from "../services/documentService";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  FileText,
  AlarmClock
} from "lucide-react";
import "../styles/Calendar.css";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  // Fetch document expiry dates from the backend
  useEffect(() => {
    const fetchExpiryEvents = async () => {
      try {
        const data = await getDocuments();

        const expiryEvents = data
          .filter((doc) => doc.expiry_date)
          .map((doc) => {
            const dateString = String(doc.expiry_date).slice(0, 10);
            const [year, month, day] = dateString.split("-").map(Number);

            const expiryDate = new Date(year, month - 1, day);
            const today = new Date();

            today.setHours(0, 0, 0, 0);

            const daysLeft = Math.ceil(
              (expiryDate - today) / (1000 * 60 * 60 * 24)
            );

            let status = "upcoming";

            if (daysLeft < 0) {
              status = "expired";
            } else if (daysLeft <= 30) {
              status = "expiring";
            }

            return {
              id: doc.id,
              title: doc.title,
              category: doc.category || "Other",
              date: dateString,
              daysLeft,
              status
            };
          });

        setEvents(expiryEvents);
      } catch (error) {
        console.error("Error fetching expiry events:", error);
      }
    };

    fetchExpiryEvents();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleString("default", {
    month: "long"
  });

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const isToday = (day) => {
    const today = new Date();

    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const isSelected = (day) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  const getEvents = (day) => {
    return events.filter((event) => {
      const [eventYear, eventMonth, eventDay] = event.date
        .split("-")
        .map(Number);

      return (
        eventDay === day &&
        eventMonth - 1 === month &&
        eventYear === year
      );
    });
  };

  const selectedEvents = events.filter((event) => {
    const [eventYear, eventMonth, eventDay] = event.date
      .split("-")
      .map(Number);

    return (
      eventDay === selectedDate.getDate() &&
      eventMonth - 1 === selectedDate.getMonth() &&
      eventYear === selectedDate.getFullYear()
    );
  });

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  const upcomingEvents = [...events]
    .filter((event) => event.status !== "expired")
    .sort((a, b) => a.date.localeCompare(b.date));

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);

    return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getStatusLabel = (event) => {
    if (event.status === "expired") return "Expired";
    if (event.status === "expiring") return "Expiring Soon";

    return `In ${event.daysLeft} days`;
  };

  return (
    <div className="calendar-page">

      {/* Page heading */}
      <div className="calendar-hero">
        <div className="calendar-heading-icon">
          <CalendarDays size={42} />
        </div>

        <div className="calendar-heading-text">
          <h1>Expiry Calendar</h1>
          <p>Track your document expiry dates at a glance</p>
        </div>

        <button className="today-button" onClick={goToToday}>
          <CalendarDays size={18} />
          Today
        </button>
      </div>

      {/* Main calendar and right-side information */}
      <div className="calendar-layout">

        {/* Calendar section */}
        <div className="calendar-card">

          <div className="calendar-topbar">
            <div className="calendar-navigation">
              <button
                onClick={previousMonth}
                aria-label="Previous month"
              >
                <ChevronLeft />
              </button>

              <h2>{monthName} {year}</h2>

              <button
                onClick={nextMonth}
                aria-label="Next month"
              >
                <ChevronRight />
              </button>
            </div>

            <div className="calendar-legend">
              <span>
                <i className="legend-dot expiring"></i>
                Expiring
              </span>

              <span>
                <i className="legend-dot expired"></i>
                Expired
              </span>

              <span>
                <i className="legend-dot upcoming"></i>
                Upcoming
              </span>
            </div>
          </div>

          <div className="calendar-grid">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
              (day) => (
                <div className="calendar-weekday" key={day}>
                  {day}
                </div>
              )
            )}

            {calendarDays.map((day, index) => {
              const dayEvents = day ? getEvents(day) : [];

              return (
                <button
                  key={index}
                  className={`calendar-day
                    ${day && isToday(day) ? "today" : ""}
                    ${day && isSelected(day) ? "selected" : ""}
                    ${!day ? "empty-day" : ""}
                  `}
                  disabled={!day}
                  onClick={() =>
                    day && setSelectedDate(new Date(year, month, day))
                  }
                >
                  {day && (
                    <>
                      <span className="calendar-day-number">{day}</span>

                      {dayEvents.length > 0 && (
                        <div className="calendar-day-dots">
                          {dayEvents.slice(0, 3).map((event) => (
                            <i
                              key={event.id}
                              className={`calendar-event-dot ${event.status}`}
                            ></i>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right-side information */}
        <div className="calendar-sidebar">

          {/* Selected date */}
          <div className="selected-date-card">
            <div className="sidebar-card-heading">
              <CalendarDays size={26} />
              <h2>Selected Date</h2>
            </div>

            <h3>
              {selectedDate.toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </h3>

            {selectedEvents.length > 0 ? (
              selectedEvents.map((event) => (
                <div
                  className="calendar-event-item"
                  key={event.id}
                >
                  <div className={`event-file-icon ${event.status}`}>
                    <FileText size={25} />
                  </div>

                  <div className="event-details">
                    <h4>{event.title}</h4>
                    <p>{event.category}</p>
                  </div>

                  <span className={`event-status ${event.status}`}>
                    {getStatusLabel(event)}
                  </span>
                </div>
              ))
            ) : (
              <p className="calendar-empty">
                No document expiry events on this date.
              </p>
            )}
          </div>

          {/* Upcoming expiries */}
          <div className="upcoming-expiries">
            <div className="upcoming-heading">
              <div>
                <AlarmClock size={27} />
                <h2>Upcoming Expiries</h2>
              </div>
              <span>View All →</span>
            </div>

            {upcomingEvents.length === 0 ? (
              <p className="calendar-empty">
                No upcoming expiries yet. Uploaded document expiry
                dates will appear here.
              </p>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  className="calendar-event-item upcoming-list-item"
                  key={event.id}
                >
                  <div className={`event-file-icon ${event.status}`}>
                    <FileText size={25} />
                  </div>

                  <div className="event-details">
                    <h4>{event.title}</h4>
                    <p>{formatDate(event.date)}</p>
                  </div>

                  <span className={`event-status ${event.status}`}>
                    {getStatusLabel(event)}
                  </span>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Calendar;