import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Profile() {
    const userContext = useContext(UserContext);
    const [profile, setProfile] = useState({});
    const [usernameToAdd, setUsernameToAdd] = useState("");

    useEffect(() => {
        const getProfile = async () => {
            const res = await fetch("http://localhost:3001/users/profile", { credentials: "include" });
            const data = await res.json();
            setProfile(data);
        };
        getProfile();
    }, []);

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
        <div className="container mt-5">
            {!userContext.user ? <Navigate replace to="/login" /> : null}
            <h1 className="text-center mb-4">{profile.username}'s Profile</h1>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Your Profile Information</h5>
                    <p className="card-text">Username: {profile.username}</p>
                    <p className="card-text">Email: {profile.email}</p>
                    <p className="card-text">Height: {profile.height}</p>
                    <p className="card-text">Weight: {profile.weight}</p>
                    <p className="card-text">Date of Creation: {profile.dateOfCreating}</p>
                    <p className="card-text">Total Points: {(profile.points / 1).toFixed(0)}</p>
                </div>
            </div>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Add Friend</h5>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" value={usernameToAdd} onChange={(e) => setUsernameToAdd(e.target.value)} placeholder="Add friend by username" />
                        <button className="btn btn-primary" onClick={handleAddFriend}>Add</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
