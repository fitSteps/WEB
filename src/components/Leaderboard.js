import React, { useEffect, useState } from 'react';

function Leaderboard() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/users/leaderboard')
            .then(response => response.json())
            .then(data => {
                console.log(data);  // Log the data here to inspect its structure
                setUsers(data);
            })
            .catch(error => console.error('Error fetching leaderboard:', error));
    }, []);
    

    return (
        <div>
            <h1>Leaderboard</h1>
            <ul>
                {Array.isArray(users) && users.map(user => (
                    <li key={user._id}>
                        {user.username} - Points: {user.points}<br />
                        Steps: {user.totalSteps}, Distance: {user.totalDistance} km,
                        Flights Climbed: {user.totalFlightsClimbed}, Calories: {user.totalCalories}
                    </li>
                ))}
            </ul>
        </div>
    );
    
}

export default Leaderboard;