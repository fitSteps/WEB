import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import L from 'leaflet';

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

    const position = [46.1512, 14.9955];

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png')
    });
    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Events</h1>
            <MapContainer center={position} zoom={9} scrollWheelZoom={true} style={{ height: '600px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {events.map((event, index) => (
                    <Marker key={index} position={[event.latitude, event.longitude]}>
                        <Popup>
                            <a href={event.link} style={{ textDecoration: 'none', color: 'black' }}>
                                <b>{event.title}</b><br/>
                                {event.dayOfWeek}, {event.day} {event.month} {event.year} - {event.time}<br/>
                                {event.location}
                            </a>
                            
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            <div className="list-group mt-3">
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
