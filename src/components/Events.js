import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <div className="container mt-5">
            <h1 className="text-center mb-4">Events List</h1>
            <div className="list-group">
                {events.map((event, index) => (
                    <a href={event.link} className="list-group-item list-group-item-action" key={index} style={{ textDecoration: 'none' }}>
                        <h3 className="mb-1">{event.title}</h3>
                        <p className="mb-1">Datum in čas: {event.dayOfWeek}, {event.day}. {event.month} {event.year} - {event.time}</p>
                        <p className="mb-1">Lokacija: {event.location}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}

export default Events;
