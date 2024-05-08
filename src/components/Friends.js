import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../userContext';

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

    return (
        <div>
            <h1>Friends List</h1>
            <ul>
                {friends.map((friend, index) => (
                    <li key={index}>
                        {friend.username} - {friend.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Friends;
