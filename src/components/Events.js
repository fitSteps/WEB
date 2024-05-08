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
                    <a href={event.link} style={{ textDecoration: 'none', color:'black' }}>
                        <li key={index} >
                        <h3>{event.title}</h3>
                        <p>Datum in čas: {event.dayOfWeek}, {event.day}. {event.month} {event.year} - {event.time}</p>
                        <p>Lokacija: {event.location}</p>
                        
                        </li>
                    </a>
                    
                ))}
            </ul>
        </div>
    );
}

export default Events;
