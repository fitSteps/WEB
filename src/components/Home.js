import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays, subDays } from 'date-fns';

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
        <>
            {!userContext.user ? <Navigate replace to="/login" /> : null}
            <h1>User Movement</h1>
            <p>Points: {profile.points}</p>
            <p>Steps: {movements.steps}</p>
            <p>Distance: {movements.distance}</p>
            <p>Date: {selectedDate.toISOString().split('T')[0]}</p>
            <p>Calories: {movements.calories}</p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button onClick={() => handleDateChange(subDays(selectedDate, 1))}>Left (-1 day)</button>
                <DatePicker 
                    selected={selectedDate} 
                    onChange={handleDateChange} 
                    dateFormat="yyyy-MM-dd" 
                    includeDateIntervals={[
                        { start: subDays(profile.dateOfCreating, 1), end: new Date() }
                    ]}
                    todayButton="Today"
                />
                <button onClick={() => handleDateChange(addDays(selectedDate, 1))}>Right (+1 day)</button>
            </div>
        </>
    );
}

export default Home;