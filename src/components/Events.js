import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import defaultIconUrl from '../assets/flag-blue2.png';
import highlightedIconUrl from '../assets/flag-red.png';

function getMonthIndex(monthName) {
    switch (monthName) {
        case "Jan": return 0;
        case "Feb": return 1;
        case "Mar": return 2;
        case "Apr": return 3;
        case "May": return 4;
        case "Jun": return 5;
        case "Jul": return 6;
        case "Aug": return 7;
        case "Sep": return 8;
        case "Oct": return 9;
        case "Nov": return 10;
        case "Dec": return 11;
        default: return -1;  
    }
}

const defaultIcon = new L.Icon({
    iconUrl: defaultIconUrl,
    iconSize: [25, 25],  
    iconAnchor: [12, 41],  
    popupAnchor: [1, -34]
});

const highlightedIcon = new L.Icon({
    iconUrl: highlightedIconUrl,
    iconSize: [25, 25],  
    iconAnchor: [12, 41],  
    popupAnchor: [1, -34]
});

function Events() {
    const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState('');
    const mapRef = useRef(null);  // Reference to the map instance
    const mapContainerRef = useRef(null);  // Reference to the map container
    const markersRef = useRef([]); // Reference to store marker instances

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

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setView([46.1512, 14.9955], 9);  // Reset the view to the default zoom level and center position
        }
        setSelectedEvent(null);  // Reset the selected event
        markersRef.current.forEach(marker => marker && marker.closePopup()); 
    }, [fromDate, toDate]);

    const handleViewOnMap = (event, index) => {
        const latLng = [event.latitude, event.longitude];
        if (mapRef.current) {
            mapRef.current.flyTo(latLng, 14);  // Fly to the event location
        }
        if (mapContainerRef.current) {
            mapContainerRef.current.scrollIntoView({ behavior: 'smooth' });  // Smooth scroll to the map container
        }
        setSelectedEvent(event);  // Highlight the marker
        if (markersRef.current[index]) {
            markersRef.current[index].openPopup();  // Open the popup for the selected marker
        }
    };

    const handleMarkerClick = (event, index) => {
        setSelectedEvent(event);
        if (markersRef.current[index]) {
            markersRef.current[index].openPopup();
        }
    };

    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.year, getMonthIndex(event.month), event.day).setHours(0, 0, 0, 0);
        const startDate = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : new Date(-8640000000000000);
        const endDate = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : new Date(8640000000000000);
        return eventDate >= startDate && eventDate <= endDate;
    });

    return (
        <div className="container mt-5" ref={mapContainerRef} >
            <h1 className="text-center mb-4">Events</h1>
            <div className="row mb-3">
                <div className="col">
                    <input
                        type="date"
                        className="form-control"
                        value={fromDate}
                        onChange={e => setFromDate(e.target.value)}
                        placeholder="From date"
                        min={today}
                    />
                </div>
                <div className="col">
                    <input
                        type="date"
                        className="form-control"
                        value={toDate}
                        onChange={e => setToDate(e.target.value)}
                        placeholder="To date"
                        min={today}
                    />
                </div>
            </div>
            
                <MapContainer
                    center={[46.1512, 14.9955]}
                    zoom={9}
                    scrollWheelZoom={true}
                    ref={mapRef}
                    style={{ height: '600px', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {filteredEvents.map((event, index) => (
                        <Marker
                            key={index}
                            position={[event.latitude, event.longitude]}
                            icon={selectedEvent === event ? highlightedIcon : defaultIcon}
                            ref={el => markersRef.current[index] = el}
                            eventHandlers={{
                                click: () => handleMarkerClick(event, index),
                            }}
                        >
                            <Popup>                                
                                <a href={event.link} style={{ textDecoration: 'none', color: 'black' }}>
                                    <div>
                                        <b>{event.title}</b><br/>
                                        {event.dayOfWeek}, {event.day} {event.month} {event.year} - {event.time}<br/>
                                        {event.location}<br/>
                                        <p><b>CLICK ME FOR REGISTRATION</b></p>
                                    </div>                                    
                                </a>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            
            <div className="list-group mt-3">
                {filteredEvents.map((event, index) => (
                    <div className="list-group-item" key={index}  onClick={() => handleViewOnMap(event, index)}>
                        <h3 className="mb-1">{event.title}</h3>
                        <p className="mb-1">Date and Time: {event.dayOfWeek}, {event.day}. {event.month} {event.year} - {event.time}</p>
                        <p className="mb-1">Location: {event.location}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Events;
