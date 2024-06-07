import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../userContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function Requests() {
    const [requests, setRequests] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            fetchRequests();
        }
    }, [user]);

    const fetchRequests = async () => {
        const response = await fetch('http://188.230.209.59:3001/users/requests', {
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
        const response = await fetch(`http://188.230.209.59:3001/users/accept-friend/${friendId}`, {
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

    const handleReject = async (friendId) => {
        const response = await fetch(`http://188.230.209.59:3001/users/reject-friend/${friendId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (response.status === 200) {
            fetchRequests();  // Refresh the requests list after rejecting
        } else {
            const data = await response.json();
            alert(data.message);  // Display error message from the server
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Friend Requests</h1>
            {requests.length > 0 ? (
                <ul className="list-group">
                    {requests.map(req => (
                        <Link 
                            to={`/profile/${req._id}`} 
                            key={req._id} 
                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center text-decoration-none"
                        >
                            <div>
                                <h5 className="mb-1">{req.username}</h5>
                                <p className="mb-1">{req.email}</p>
                            </div>
                            <div>
                                <button 
                                    className="btn btn-primary me-2" 
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent the default link action
                                        handleAccept(req._id);
                                    }}
                                >
                                    Accept
                                </button>
                                <button 
                                    className="btn btn-danger" 
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent the default link action
                                        handleReject(req._id);
                                    }}
                                >
                                    Reject
                                </button>
                            </div>
                        </Link>
                    ))}
                </ul>
            ) : (
                <p className="text-center">No friend requests found.</p>
            )}
        </div>
    );
}

export default Requests;
