import React, { useEffect, useState } from 'react';

function Leaderboard() {
    const [users, setUsers] = useState([]);
    const [topMovements, setTopMovements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("Fetching leaderboard data...");
        setIsLoading(true);
        Promise.all([
            fetch('http://localhost:3001/users/leaderboard'),
            fetch('http://localhost:3001/movements/top-movements')
        ])
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(data => {
            console.log("Data fetched successfully:", data);
            setUsers(data[0]);
            setTopMovements(data[1]);
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        console.log("Loading data...");
        return <div>Loading...</div>;
    }

    console.log("Rendering data to the screen.");
    return (
        <div>
            <h1>Leaderboard</h1>
            {users.length ? (
                <ul>
                    {users.map(user => (
                        <li key={user._id}>
                            {user.username} - Points: {user.points}<br />
                            Steps: {user.totalSteps}, Distance: {user.totalDistance} km,
                            Flights Climbed: {user.totalFlightsClimbed}, Calories: {user.totalCalories}
                        </li>
                    ))}
                </ul>
            ) : <p>No user data available.</p>}
            <h2>Top Movements</h2>
            {topMovements.length ? (
                <ul>
                    {topMovements.map(movement => (
                        <li key={movement._id}>
                            {movement.username} - Distance: {movement.distance} km, Date: {new Date(movement.date).toLocaleDateString()}<br />
                            Steps: {movement.steps}, Flights Climbed: {movement.flightsClimbed}, Calories: {movement.calories}
                        </li>
                    ))}
                </ul>
            ) : <p>No movement data available11.</p>}
        </div>
    );
}

export default Leaderboard;
