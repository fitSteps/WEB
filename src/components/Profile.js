import React, { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function CameraApp({ onVideoSubmit }) {
  const videoRef = useRef(null);
  const [videoURL, setVideoURL] = useState(null);
  const [captured, setCaptured] = useState(false);

  const captureVideo = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Media Devices will not work on your browser. Please try a different browser.");
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        startRecording();
      })
      .catch(err => {
        console.error("Error accessing the camera: ", err);
      });
  };

  const startRecording = () => {
    const mediaRecorder = new MediaRecorder(videoRef.current.srcObject);
    let videoChunks = [];

    mediaRecorder.ondataavailable = e => {
      videoChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(videoChunks, { type: 'video/mp4' });
      const videoURL = URL.createObjectURL(blob);
      setVideoURL(videoURL);
      setCaptured(true);
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      onVideoSubmit(blob); // Callback to handle the video blob outside of the component
    };

    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
    }, 4000);
  };

  return (
    <div>
      <button onClick={captureVideo}>{captured ? "Redo" : "Capture 4s Video"}</button>
      <div style={{ position: 'relative', width: '244px', height: '244px', overflow: 'hidden' }}>
        <video ref={videoRef} width="244" height="244" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} controls autoPlay />
      </div>
      {videoURL && <video src={videoURL} width="244" height="244" controls autoPlay />}
    </div>
  );
}

function Profile() {
  const userContext = useContext(UserContext);
  const [profile, setProfile] = useState({});
  const [usernameToAdd, setUsernameToAdd] = useState("");
  const [showModal, setShowModal] = useState(false);

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

  const handleVideoSubmit = (videoBlob) => {
    const formData = new FormData();
    formData.append("video", videoBlob, "faceUnlockVideo.mp4");
    fetch("http://localhost:3001/users/uploadVideo", {
      method: "POST",
      body: formData,
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      console.log("Video uploaded successfully:", data);
      setShowModal(false); // Close modal on successful upload
    })
    .catch(err => {
      console.error("Error uploading video:", err);
    });
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
      <Button variant="primary" onClick={() => setShowModal(true)}>Add Face Unlock</Button>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Face Unlock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CameraApp onVideoSubmit={handleVideoSubmit} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Profile;
