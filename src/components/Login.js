import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const userContext = useContext(UserContext);

    async function handleLogin(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:3001/users/login", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password,
                phoneUUID: "",
            })
        });
        const data = await res.json();
        if (data._id !== undefined) {
            userContext.setUserContext(data);
        } 
        else if (data = null) {
            setError("Not authorized");
        }
        else {
            setError(data.message);
        }
    }

    return (
        <div className="container mt-5 d-flex justify-content-center">
            {userContext.user ? <Navigate replace to="/" /> : null}
            <form onSubmit={handleLogin} style={{ maxWidth: '300px', width: '100%' }}>
                <h2 className="mb-4 text-center">Login</h2>
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
                {error && <div className="text-danger text-center mt-3">{error}</div>}
                <button type="submit" className="btn btn-primary w-100">Log in</button>
            </form>
        </div>
    );
}

export default Login;
