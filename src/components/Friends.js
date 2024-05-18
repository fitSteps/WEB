import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../userContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function Friends() {
    const [friends, setFriends] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            fetchFriends();
        }
    }, [user]);

    const fetchFriends = async () => {
        const response = await fetch('http://localhost:3001/users/friends', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'  
        });
        if (response.ok) {
            const data = await response.json();
            setFriends(data);
        } else {
            console.error('Failed to fetch friends:', response.statusText);
        }
    };

    const handleUnfriend = async (friendUsername) => {
        const response = await fetch(`http://localhost:3001/users/unfriend/`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: friendUsername }),
            credentials: "include"
        });
        if (response.status === 200) {
            fetchFriends();  // Refresh the friends list after unfriending
        } else {
            const data = await response.json();
            alert(data.message);  // Display error message from the server
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Friends List</h1>
            <div className="list-group">
                {friends.length > 0 ? (
                    friends.map((friend, index) => (
                        <Link 
                            to={`/profile/${friend._id}`} 
                            key={index} 
                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center text-decoration-none"
                        >
                            <div>
                                <h5 className="mb-1">{friend.username}</h5>
                                <p className="mb-1">{friend.email}</p>
                            </div>
                            <button 
                                className="btn btn-danger" 
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent the default link action
                                    handleUnfriend(friend.username);
                                }}
                            >
                                Unfriend
                            </button>
                        </Link>
                    ))
                ) : (
                    <p className="text-center">No friends found.</p>
                )}
            </div>
        </div>
    );
}

export default Friends;
