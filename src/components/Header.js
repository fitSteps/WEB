import React, { useContext } from "react";
import { UserContext } from "../userContext";
import { Link } from "react-router-dom"

function Header(props) {
    const { user } = useContext(UserContext);

    return (
        <header className="bg-dark text-white p-3">
            <div className="container">
            {user && <h1 className="text-center">{user.username}'s fitSteps</h1>}
            {!user && <h1 className="text-center">fitSteps</h1>}
                <h1 className="text-center"></h1>
                <nav className="navbar navbar-expand-lg navbar-dark">
                    <div className="container-fluid">
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                            <ul className="navbar-nav">
                                {user ? (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to='/'>Home</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to='/profile'>Profile</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to='/logout'>Logout</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to='/requests'>Requests</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to='/friends'>Friends</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to='/events'>Events</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to='/datafaker'>Data Faker</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to='/leaderboard'>Leaderboard</Link>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to='/login'>Login</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to='/register'>Register</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to='/events'>Events</Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Header;