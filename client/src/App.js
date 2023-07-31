import Home from "./Pages/Home"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import UserHome from "./Pages/UserHome"
import Create from "./Pages/Create"
import Profile from "./Pages/Profile"
import QuizView from "./Pages/QuizView"
import History from "./Pages/History"
import Friend from "./Pages/Friend"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"


export default function App() {
  return <div>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<UserHome />} />
        <Route path="/create" element={<Create />} />
        <Route path="/user/:username" element={<Profile />} />
        <Route path="/quiz/:quizID/play" element={<QuizView />} />
        <Route path="/history" element={<History />} />
        <Route path='/friends' element={<Friend />} />
      </Routes>
    </Router>
  </div>
}