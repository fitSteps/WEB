import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [error, setError] = useState("");

    async function handleRegister(e) {
        e.preventDefault();
        const res = await fetch("http://108.143.161.80:3001/users", {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password,
                height: height,
                weight: weight
            })
        });
        const data = await res.json();
        if (data._id !== undefined) {
            window.location.href = "/";
        } else {
            setUsername("");
            setPassword("");
            setEmail("");
            setHeight("");
            setWeight("");
            setError("Registration failed");
        }
    }

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <form onSubmit={handleRegister} style={{ maxWidth: '300px', width: '100%' }}>
                <h2 className="mb-4 text-center">Register</h2>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" placeholder="Email"
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" id="username" name="username" placeholder="Username"
                        value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" placeholder="Password"
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="height" className="form-label">Height</label>
                    <input type="number" className="form-control" id="height" name="height" placeholder="Height"
                        value={height} onChange={(e) => setHeight(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="weight" className="form-label">Weight</label>
                    <input type="number" className="form-control" id="weight" name="weight" placeholder="Weight"
                        value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <button type="submit" className="btn btn-primary w-100">Register</button>
            </form>
        </div>
    );
}

export default Register;
