import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays, subDays } from 'date-fns';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
    const userContext = useContext(UserContext);
    const [profile, setProfile] = useState({});
    const [movements, setMovements] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        getProfile();
        getMovements(selectedDate);
    }, []);

    const getProfile = async () => {
        const res = await fetch("http://localhost:3001/users/profile", { credentials: "include" });
        const data = await res.json();
        setProfile(data);
    };

    const getMovements = async (date) => {
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const res = await fetch(`http://localhost:3001/users/movements/${formattedDate}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        });
        const data = await res.json();
        setMovements(data);
    };

    const handleDateChange = (date) => {
        if (date < new Date(profile.dateOfCreating) || date > new Date()) return;
        setSelectedDate(date);
        getMovements(date);
    };

    return (
        <div className="container mt-5">
            {!userContext.user ? <Navigate replace to="/login" /> : null}
            <h1 className="text-center mb-4">Stats from {selectedDate.toISOString().split('T')[0]}</h1>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Your Profile Stats Information</h5>
                    <p className="card-text">Points: {(profile.points / 1).toFixed(0)}</p>
                    <p className="card-text">Steps: {movements.steps}</p>
                    <p className="card-text">Distance: {(movements.distance / 1000).toFixed(2)} km</p>
                    <p className="card-text">Flights Climbed: {movements.flightsClimbed}</p>
                    <p className="card-text">Calories: {(movements.calories / 1).toFixed(0)}</p>
                </div>
            </div>
            <div className="d-flex justify-content-center align-items-center mb-4">
                <button className="btn btn-secondary me-2" onClick={() => handleDateChange(subDays(selectedDate, 1))}>-1 day</button>
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    includeDateIntervals={[
                        { start: subDays(new Date(profile.dateOfCreating), 1), end: new Date() }
                    ]}
                    todayButton="Today"
                    className="form-control"
                />
                <button className="btn btn-secondary ms-2" onClick={() => handleDateChange(addDays(selectedDate, 1))}>+1 day</button>
            </div>
        </div>
    );
}

export default Home;
