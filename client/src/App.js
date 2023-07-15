import Home from "./Pages/Home"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import UserHome from "./Pages/UserHome"
import Create from "./Pages/Create"
import Profile from "./Pages/Profile"
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
      </Routes>
    </Router>
  </div>
}