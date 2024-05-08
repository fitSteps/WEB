import React, { useEffect, useState } from 'react';

function Events() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const response = await fetch('http://localhost:3001/events', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'  
        });
        if (response.ok) {
            const data = await response.json();
            setEvents(data);
        } else {
            console.error('Failed to fetch events:', response.statusText);
        }
    };

    return (
        <div>
            <h1>Events List</h1>
            <ul>
                {events.map((event, index) => (
                    <li key={index}>
                        <h3>{event.title}</h3>
                        <p>{event.day}. {event.dayOfWeek}, {event.month} {event.year}</p>
                        <p>{event.city}</p>
                        
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Events;
