import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Profile() {
    const userContext = useContext(UserContext); 
    const [profile, setProfile] = useState({});
    const [movements, setMovements] = useState([]);
    const [usernameToAdd, setUsernameToAdd] = useState(""); // Define usernameToAdd state variable

    useEffect(function() {
        const getProfile = async function() {
            const res = await fetch("http://localhost:3001/users/profile", {credentials: "include"});
            const data = await res.json();
            setProfile(data);
        }
        getProfile();
        getMovements();
    }, []);

    const getProfile = async function() {
        const res = await fetch("http://localhost:3001/users/profile", {credentials: "include"});
        const data = await res.json();
        setProfile(data);
    };


    const getMovements = async () => {
        const date = "2024-05-13";
        const res = await fetch(`http://localhost:3001/users/movements/${date}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }, credentials: "include"
        });
        const data = await res.json();
        console.log(data);
        console.log(data.steps);
        setMovements(data);
    };

    const handleAddFriend = async () => {
        const res = await fetch(`http://localhost:3001/users/addFriendRequest`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameToAdd }),
            credentials: "include"
        });
        const data = await res.json();
        alert(data.message); 
    };

    return (
        <>
            {!userContext.user ? <Navigate replace to="/login" /> : null}
            <h1>User Profile</h1>
            <p>Username: {profile.username}</p>
            <p>Email: {profile.email}</p>
            <p>Steps: {movements.steps}</p>
            <p>Distance: {movements.distance}</p>
            <p>Date: {(movements.date)}</p>
            <p>Calories: {movements.calories}</p>
            <input type="text" value={usernameToAdd} onChange={(e) => setUsernameToAdd(e.target.value)} placeholder="Add friend by username" />
            <button onClick={handleAddFriend}>Add</button>
        </>
    );
}

export default Profile;
