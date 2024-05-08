import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../userContext';

function Requests() {
    const [requests, setRequests] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            fetchRequests();
        }
    }, [user]);

    const fetchRequests = async () => {
        const response = await fetch('http://localhost:3001/users/requests', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        const data = await response.json();
        if (response.status === 200) {
            setRequests(data);
        } else {
            alert(data.message);
        }
    };

    const handleAccept = async (friendId) => {
        const response = await fetch(`http://localhost:3001/users/accept-friend/${friendId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (response.status === 200) {
            fetchRequests();  // Refresh the requests list after accepting
        } else {
            const data = await response.json();
            alert(data.message);  // Display error message from the server
        }
    };

    return (
        <div>
            <h1>Friend Requests</h1>
            <ul>
                {requests.length > 0 ? requests.map(req => (
                    <li key={req._id}>
                        {req.username} - {req.email}
                        <button onClick={() => handleAccept(req._id)}>Accept</button>
                    </li>
                )) : <p>No friend requests found.</p>}
            </ul>
        </div>
    );
}

export default Requests;
