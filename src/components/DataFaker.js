import React, { useEffect, useState } from 'react';

function DataFaker() {
    const [date] = useState("2024-05-08");
    const [steps, setSteps] = useState(0);
    const [distance, setDistance] = useState(0);
    const [flightsClimbed, setFlightsClimbed] = useState(0);
    const [calories, setCalories] = useState(0);

    useEffect(() => {
        // If needed, fetch initial data here or remove if not necessary
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent default form submission
        var date = "2024-05-08";
        const response = await fetch(`http://localhost:3001/users/movements/${date}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                steps,
                distance,
                flightsClimbed,
                calories
            })
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
                <input type='number' value={steps} placeholder='Number of steps' onChange={(e) => setSteps(e.target.value)}/>
                <input type='number' value={distance} placeholder='Distance' onChange={(e) => setDistance(e.target.value)}/>
                <input type='number' value={flightsClimbed} placeholder='Flights climbed' onChange={(e) => setFlightsClimbed(e.target.value)}/>
                <input type='number' value={calories} placeholder='Calories' onChange={(e) => setCalories(e.target.value)}/>
                <button type='submit'>Submit</button>
            </form>
        </div>
    );
}

export default DataFaker;