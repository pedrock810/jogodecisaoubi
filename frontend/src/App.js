import React, { useState } from "react";
import Login from "./Login";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from "./Signup";
import Admin from "./backoffice/Admin";
import UsersManage from "./backoffice/UsersManage";
import AnswersManage from "./backoffice/AnswersManage";
import RewardsManage from "./backoffice/RewardsManage";
import Home from './gamescene/Home';
import StartGame from "./gamescene/game/StartGame";
import Ranking from "./gamescene/ranking/Ranking";
import Rewards from './gamescene/rewards/Rewards';
import Tutorial from "./gamescene/tutorial/Tutorial";
import UserRewards from './gamescene/rewards/UserRewards'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} setUserName={setUserName} />} />
        <Route path="/signup" element={<Signup />} />
        {isLoggedIn && <Route path="/home" element={<Home userName={userName} setIsLoggedIn={setIsLoggedIn} userId={localStorage.getItem('userId')} />} />}
        {isLoggedIn && <Route path="/start-game" element={<StartGame />} />}
        {isLoggedIn && <Route path="/ranking" element={<Ranking />} />}
        {isLoggedIn && <Route path="/rewards" element={<Rewards />} />}
        {isLoggedIn && <Route path="/user-rewards" element={<UserRewards userId={localStorage.getItem('userId')} />} />} 
        {isLoggedIn && <Route path="/tutorial" element={<Tutorial />} />}
        {isLoggedIn && <Route path="/admin" element={<Admin setIsLoggedIn={setIsLoggedIn} />} />}
        {isLoggedIn && <Route path="/admin/users" element={<UsersManage setIsLoggedIn={setIsLoggedIn} />} />}
        {isLoggedIn && <Route path="/admin/answers" element={<AnswersManage setIsLoggedIn={setIsLoggedIn} />} />}
        {isLoggedIn && <Route path="/admin/rewards" element={<RewardsManage setIsLoggedIn={setIsLoggedIn} />} />}
        {!isLoggedIn && <Route path="*" element={<Navigate to="/" replace />} />}
      </Routes>
    </BrowserRouter>
  )
}

export default App;