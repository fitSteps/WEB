import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function Leaderboard() {
    const [users, setUsers] = useState([]);
    const [topMovements, setTopMovements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Fetching leaderboard data...");
        setIsLoading(true);
        Promise.all([
            fetch('http://188.230.209.59:3001/users/leaderboard'),
            fetch('http://188.230.209.59:3001/movements/top-movements')
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

    const handleRowClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    if (isLoading) {
        console.log("Loading data...");
        return <div className="text-center my-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    }

    console.log("Rendering data to the screen.");
    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Leaderboard</h1>
            <div className="card mb-4">
                <div className="card-body">
                    <h2 className="card-title">Top Users</h2>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Points</th>
                                    <th>Steps</th>
                                    <th>Distance (km)</th>
                                    <th>Flights Climbed</th>
                                    <th>Calories</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} onClick={() => handleRowClick(user._id)} style={{ cursor: 'pointer' }}>
                                        <td>{user.username}</td>
                                        <td>{(user.points / 1).toFixed(0)}</td>
                                        <td>{user.totalSteps}</td>
                                        <td>{(user.totalDistance / 1000).toFixed(2)}</td>
                                        <td>{user.totalFlightsClimbed}</td>
                                        <td>{(user.totalCalories / 1).toFixed(0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="card mb-4">
                <div className="card-body">
                    <h2 className="card-title">Top Movements</h2>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Distance (km)</th>
                                    <th>Date</th>
                                    <th>Steps</th>
                                    <th>Flights Climbed</th>
                                    <th>Calories</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topMovements.map(movement => (
                                    <tr key={movement._id} onClick={() => handleRowClick(movement._id)} style={{ cursor: 'pointer' }}>
                                        <td>{movement.username}</td>
                                        <td>{(movement.distance / 1000).toFixed(2)}</td>
                                        <td>{new Date(movement.date).toLocaleDateString()}</td>
                                        <td>{movement.steps}</td>
                                        <td>{movement.flightsClimbed}</td>
                                        <td>{(movement.calories / 1).toFixed(0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;