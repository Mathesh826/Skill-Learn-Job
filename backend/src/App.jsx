import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';          
import UserPage from "./pages/UserPage"; 
import RecruiterLogin from "./pages/RecruiterLogin";
import RecruiterPage from "./pages/RecruiterPage";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default Home Page */}
        <Route path="/" element={<Home />} />

        {/* After login redirect */}
        <Route path="/userpage" element={<UserPage />} />

        <Route path="/recruiter-login" element={<RecruiterLogin />} />

        <Route path="/recruiter/dashboard" element={<RecruiterPage />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;

