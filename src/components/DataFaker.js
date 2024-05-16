import React, { useState } from 'react';

function DataFaker() {
    const [steps, setSteps] = useState(0);
    const [distance, setDistance] = useState(0);
    const [flightsClimbed, setFlightsClimbed] = useState(0);
    const [calories, setCalories] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const date = "2024-05-15";
        const response = await fetch(`http://localhost:3001/users/movements/${date}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ steps, distance, flightsClimbed, calories })
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Success:', data);
        } else {
            console.error('Failed to update movements:', response.statusText);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type='number' value={steps} onChange={(e) => setSteps(e.target.value)} placeholder='Number of steps'/>
                <input type='number' value={distance} onChange={(e) => setDistance(e.target.value)} placeholder='Distance'/>
                <input type='number' value={flightsClimbed} onChange={(e) => setFlightsClimbed(e.target.value)} placeholder='Flights climbed'/>
                <input type='number' value={calories} onChange={(e) => setCalories(e.target.value)} placeholder='Calories'/>
                <button type='submit'>Submit</button>
            </form>
        </div>
    );
}

export default DataFaker;
