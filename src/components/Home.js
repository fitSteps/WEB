import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays, subDays, addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Home() {
    const userContext = useContext(UserContext);
    const [profile, setProfile] = useState({});
    const [movements, setMovements] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [chartDate, setChartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [weeklyData, setWeeklyData] = useState([]);
    const [chartMetric, setChartMetric] = useState('steps');  // default to steps

    useEffect(() => {
        getProfile();
        getMovements(selectedDate);
        loadWeeklyData(chartDate);
    }, [selectedDate, chartDate, chartMetric]);

    const getProfile = async () => {
        const res = await fetch("http://188.230.209.59:3001/users/profile", { credentials: "include" });
        const data = await res.json();
        setProfile(data);
    };

    const getMovements = async (date) => {
        const formattedDate = formatDate(date);
        const res = await fetch(`http://188.230.209.59:3001/users/movements/${formattedDate}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        });
        const data = await res.json();
        setMovements(data);
    };

    const loadWeeklyData = async (date) => {
        let weekData = [];
        const startDate = startOfWeek(date, { weekStartsOn: 1 });
        const endDate = endOfWeek(date, { weekStartsOn: 1 });

        for (let i = 0; i <= 6; i++) {
            const day = addDays(startDate, i);
            const res = await fetch(`http://188.230.209.59:3001/users/movements/${formatDate(day)}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });
            const data = await res.json();
            weekData.push({ date: formatDate(day), ...data });
        }
        setWeeklyData(weekData);
    };

    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const handleDateChange = (date) => {
        if (date < new Date(profile.dateOfCreating) || date > new Date()) return;
        setSelectedDate(date);
        getMovements(date);
    };

    const handleChartDateChange = (date) => {
        const start = startOfWeek(date, { weekStartsOn: 1 });
        setChartDate(start);
        loadWeeklyData(start);
    };

    const handleMetricChange = (e) => {
        setChartMetric(e.target.value);
    };

    const data = {
        labels: weeklyData.map(day => format(new Date(day.date), 'yyyy-MM-dd')),
        datasets: [
            {
                label: chartMetric.charAt(0).toUpperCase() + chartMetric.slice(1), // Capitalize first letter
                data: weeklyData.map(day => day[chartMetric]),
                backgroundColor: 'rgba(200, 200, 200)',
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    callback: function(val, index) {
                        // Format dates as 'day.month.year'
                        return weeklyData[index] ? format(new Date(weeklyData[index].date), 'dd.MM.yyyy') : '';
                    }
                }
            },
            y: {
                grid: {
                    borderDash: [8, 4],
                    color: "#ccc",
                },
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                display: true,
                position: "top",
                labels: {
                    color: '#666',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat().format(context.parsed.y);
                        }
                        return label;
                    },
                    title: function(tooltipItems) {
                        // Also format tooltip titles to 'day.month.year'
                        return format(new Date(tooltipItems[0].label), 'dd/MM/yyyy');
                    }
                },
                usePointStyle: true,
                bodyColor: '#666',
            },
            title: {
                display: true,
                text: `Weekly ${chartMetric.charAt(0).toUpperCase() + chartMetric.slice(1)} Overview`,
                color: '#333',
                font: {
                    size: 18,
                    weight: 'bold'
                }
            }
        },
        onClick: handleBarClick, // Add the click handler
    };

    function handleBarClick(e, elements) {
        if (elements.length === 0) return;  // No bar clicked
    
        const index = elements[0].index;
        const clickedDate = weeklyData[index].date;
        const newDate = new Date(clickedDate);
        
        setSelectedDate(newDate); // Update the selected date state
        getMovements(newDate);  // Fetch data for the new date
    }

    return (
        <div className="container mt-5">
            {!userContext.user ? <Navigate replace to="/login" /> : null}
            <h1 className="text-center mb-4">Stats from {selectedDate.toISOString().split('T')[0]}</h1>
            <div className="d-flex flex-column flex-lg-row justify-content-center align-items-start">
                <div className="card mb-4" style={{width: "100%", height: '364px', flex: 1, border: "none"}}>
                    <div className="card-body">
                        <h5 className="card-title">Your Profile Stats Information</h5>
                        <p className="card-text">Points: {(profile.points / 1).toFixed(0)}</p>
                        <p className="card-text">Steps: {movements.steps}</p>
                        <p className="card-text">Distance: {(movements.distance / 1000).toFixed(2)} km</p>
                        <p className="card-text">Flights Climbed: {movements.flightsClimbed}</p>
                        <p className="card-text">Calories: {(movements.calories / 1).toFixed(0)}</p>
                    </div>
                    <div className="d-flex justify-content-center align-items-center mb-4">
                            <button className="btn btn-secondary me-2" onClick={() => handleDateChange(subDays(selectedDate, 1))}>PREVIOUS DAY</button>
                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                dateFormat="dd/MM/yyyy"
                                includeDateIntervals={[
                                    { start: subDays(new Date(profile.dateOfCreating), 1), end: new Date() }
                                ]}
                                todayButton="Today"
                                className="form-control"
                            />
                            <button className="btn btn-secondary ms-2" onClick={() => handleDateChange(addDays(selectedDate, 1))}>NEXT DAY</button>
                        </div>
                </div>
                <div className="chart-container" style={{ width: '100%', maxWidth: '600px', height: '400px', flex: 2 }}>
                    <Bar data={data} options={options} />
                    <div className="d-flex justify-content-center align-items-center mb-4">
                        <button className="btn btn-info me-2" onClick={() => handleChartDateChange(subWeeks(chartDate, 1))}>PREVIOUS WEEK</button>
                        <DatePicker
                            selected={chartDate}
                            onChange={handleChartDateChange}
                            dateFormat="dd/MM/yyyy"
                            todayButton="Today"
                            className="form-control"
                        />
                        <button className="btn btn-info ms-2" onClick={() => handleChartDateChange(addWeeks(chartDate, 1))}>NEXT WEEK</button>
                    </div>
                    <select className="form-control mb-3" onChange={handleMetricChange} value={chartMetric}>
                        <option value="steps">Steps</option>
                        <option value="distance">Distance</option>
                        <option value="calories">Calories</option>
                        <option value="flightsClimbed">Flights Climbed</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default Home;
