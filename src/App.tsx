import {BrowserRouter, Routes, Route} from "react-router-dom";
// import './App.css'
import {Home} from "./pages/home.tsx";
import {Login} from "./pages/login.tsx";
import {Signup} from "./pages/signup.tsx";
import {Dashboard} from "./pages/dashboard.tsx";
import PageLuisa from "./pages/PageLuisa.tsx";
import {PageCharlie} from "./pages/pageCharlie.tsx";
import Questionnaire from "./pages/Questionnaire.tsx";


function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/PageLuisa" element={<PageLuisa/>}/>
                    <Route path="/pageCharlie" element={<PageCharlie />}/>
                    <Route path="/questionnaire" element={<Questionnaire/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
