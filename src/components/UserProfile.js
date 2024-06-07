import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../userContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserProfile() {
    const { userId } = useParams();
    const { user } = useContext(UserContext);
    const [profile, setProfile] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);
    const [hasReceivedFriendRequestFromProfileUser, setHasReceivedFriendRequestFromProfileUser] = useState(false);
    const [areFriends, setAreFriends] = useState(false);

    useEffect(() => {
        const getProfile = async () => {
            const res = await fetch(`http://188.230.209.59:3001/users/profile/${userId}`, { credentials: "include" });
            const data = await res.json();
            setProfile(data);
            setIsFriendRequestSent(data.isFriendRequestSent);
            setHasReceivedFriendRequestFromProfileUser(data.hasReceivedFriendRequestFromProfileUser);
            setAreFriends(data.areFriends);
            setIsLoading(false);
        };
        getProfile();
    }, [userId]);

    const handleAddFriend = async () => {
        const res = await fetch(`http://188.230.209.59:3001/users/addFriendRequest`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: profile.username }),
            credentials: "include"
        });
        if (res.ok) {
            setIsFriendRequestSent(true);
        }
    };

    const handleCancelFriendRequest = async () => {
        const res = await fetch(`http://188.230.209.59:3001/users/cancelFriendRequest`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: profile.username }),
            credentials: "include"
        });
        if (res.ok) {
            setIsFriendRequestSent(false);
        }
    };

    const handleUnfriend = async () => {
        const res = await fetch(`http://188.230.209.59:3001/users/unfriend`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: profile.username }),
            credentials: "include"
        });
        if (res.ok) {
            setAreFriends(false);
        }
    };

    const handleAcceptFriendRequest = async () => {
        const res = await fetch(`http://188.230.209.59:3001/users/accept-friend/${userId}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        });
        if (res.ok) {
            setAreFriends(true);
            setHasReceivedFriendRequestFromProfileUser(false);
        }
    };

    const handleRejectFriendRequest = async () => {
        const res = await fetch(`http://188.230.209.59:3001/users/reject-friend/${userId}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        });
        if (res.ok) {
            setHasReceivedFriendRequestFromProfileUser(false);
        }
    };

    if (isLoading) {
        return <div className="text-center my-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    }

    const isOwnProfile = user && user._id === userId;

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">User Profile</h1>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Profile Information</h5>
                    <p className="card-text">Username: {profile.username}</p>
                    <p className="card-text">Email: {profile.email}</p>
                    <p className="card-text">Height: {profile.height}</p>
                    <p className="card-text">Weight: {profile.weight}</p>
                    <p className="card-text">Date of Creation: {profile.dateOfCreating}</p>
                    <p className="card-text">Total Points: {profile.points}</p>
                    {!isOwnProfile && (
                        <>
                            {areFriends ? (
                                <button 
                                    className="btn btn-danger mt-3"
                                    onClick={handleUnfriend}
                                >
                                    Unfriend
                                </button>
                            ) : isFriendRequestSent ? (
                                <button 
                                    className="btn btn-danger mt-3"
                                    onClick={handleCancelFriendRequest}
                                >
                                    Cancel Friend Request
                                </button>
                            ) : hasReceivedFriendRequestFromProfileUser ? (
                                <>
                                    <button 
                                        className="btn btn-primary mt-3 me-2"
                                        onClick={handleAcceptFriendRequest}
                                    >
                                        Accept Friend Request
                                    </button>
                                    <button 
                                        className="btn btn-danger mt-3"
                                        onClick={handleRejectFriendRequest}
                                    >
                                        Reject Friend Request
                                    </button>
                                </>
                            ) : (
                                <button 
                                    className="btn btn-primary mt-3"
                                    onClick={handleAddFriend}
                                >
                                    Add Friend
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
