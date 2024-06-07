import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function DataFaker() {
    const [steps, setSteps] = useState(0);
    const [distance, setDistance] = useState(0);
    const [flightsClimbed, setFlightsClimbed] = useState(0);
    const [calories, setCalories] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const date = "2024-05-15";
        const response = await fetch(`http://188.230.209.59:3001/users/movements/${date}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ steps, distance, flightsClimbed, calories })
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Success:', data);
        } else {
            console.error('Failed to update movements:', response.statusText);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Data Faker</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="steps" className="form-label">Number of Steps</label>
                                    <input type="number" className="form-control" id="steps" value={steps} onChange={(e) => setSteps(e.target.value)} placeholder="Number of steps" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="distance" className="form-label">Distance</label>
                                    <input type="number" className="form-control" id="distance" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="Distance" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="flightsClimbed" className="form-label">Flights Climbed</label>
                                    <input type="number" className="form-control" id="flightsClimbed" value={flightsClimbed} onChange={(e) => setFlightsClimbed(e.target.value)} placeholder="Flights climbed" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="calories" className="form-label">Calories</label>
                                    <input type="number" className="form-control" id="calories" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="Calories" />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DataFaker;