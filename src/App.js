import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from "./userContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Logout from "./components/Logout";
import Requests from "./components/Requests";
import Friends from "./components/Friends";
import Events from "./components/Events";
import DataFaker from './components/DataFaker';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';
import UserProfile from './components/UserProfile';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  const [user, setUser] = useState(localStorage.user ? JSON.parse(localStorage.user) : null);
  const updateUserData = (userInfo) => {
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  }

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user: user, setUserContext: updateUserData }}>
        <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header title="My application"></Header>
          <div style={{ flex: 1, overflow: 'auto', minHeight: 'calc(100vh - 100px)' }}>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/login" exact element={<Login />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/profile/:userId" element={<UserProfile />}></Route>
              <Route path="/logout" element={<Logout />}></Route>
              <Route path="/requests" element={<Requests />}></Route>
              <Route path="/friends" element={<Friends />}></Route>
              <Route path="/events" element={<Events />}></Route>
              <Route path="/datafaker" element={<DataFaker />}></Route>
              <Route path="/leaderboard" element={<Leaderboard />}></Route>
              <Route path="/movements" element={<Leaderboard />}></Route>
            </Routes>
          </div>
          <Footer></Footer>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
