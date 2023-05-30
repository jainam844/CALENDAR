import './App.css';
import { Calender } from './Calender/calender';
import { MockEvents } from './Calender/const';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [events, setEvents] = useState(() => {
    const storedEvents = localStorage.getItem('events');
    return storedEvents ? JSON.parse(storedEvents) : MockEvents;
  });

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
    const timeouts = [];

    events.forEach((event) => {
      const [hours, minutes] = (event.reminderTime ?? "").split(":").map(Number);

      if (event.date) {
        const reminderTime = new Date(
          parseInt(event.date.slice(0, 4)),
          parseInt(event.date.slice(5, 7)) - 1,
          parseInt(event.date.slice(8, 10))
        );
        reminderTime.setHours(hours);
        reminderTime.setMinutes(minutes);

        if (reminderTime > new Date()) {
          const timeUntilEvent = reminderTime.getTime() - Date.now();

          const timeoutId = setTimeout(() => {
            toast.info(event.title + "\nReminder");
            const index = timeouts.indexOf(timeoutId);
            if (index > -1) {
              timeouts.splice(index, 1);
            }
          }, timeUntilEvent);

          timeouts.push(timeoutId);
        }
      }
    });

    return () => {
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [events]);

  const addEvent = (data, date) => {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    setEvents((prev) => [...prev, { date: utcDate.toISOString(), title: data.title, desc: data.desc, reminderTime: data.reminderTime }]);
  };

  const editEvent = (eventToBeEdited, newData) => {
    setEvents((prev) =>
      prev.map((event) =>
        event === eventToBeEdited
          ? { ...event, title: newData.title, desc: newData.desc, reminderTime: newData.reminderTime }
          : event
      )
    );
  };

  const removeEvent = (eventToBeDeleted) => {
    setEvents((prev) => prev.filter(event => event.title !== eventToBeDeleted.title || event.date !== eventToBeDeleted.date || event.reminderTime !== eventToBeDeleted.reminderTime));
  };

  return (
    <div className="App">
      <ToastContainer />
      <Calender startingDate={new Date()} eventsArr={events} addEvent={addEvent} editEvent={editEvent} removeEvent={removeEvent} />
    </div>
  );
}

export default App;
