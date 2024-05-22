import React, { useContext } from 'react';
import { UserContext } from '../userContext';
import { Link } from 'react-router-dom';

function Footer() {
    const { user } = useContext(UserContext);

    return (
        <footer className="bg-dark text-white p-3 mt-5">
            <div className="container text-center">
                <p>{user ? `${user.username}'s fitSteps` : 'fitSteps'}</p>
                <nav className="navbar navbar-expand-lg navbar-dark justify-content-center">
                    <ul className="navbar-nav">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to='/privacy'>Privacy Policy</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to='/terms'>Terms of Service</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to='/support'>Support</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to='/about'>About Us</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to='/contact'>Contact</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to='/help'>Help</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
                <small>&copy; {new Date().getFullYear()} fitSteps. All rights reserved.</small>
            </div>
        </footer>
    );
}

export default Footer;