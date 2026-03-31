import {BrowserRouter, Routes, Route} from "react-router-dom";
// import './App.css'
import {Home} from "./pages/home.tsx";
import {Login} from "./pages/login.tsx";
import {Signup} from "./pages/signup.tsx";
import {Dashboard} from "./pages/dashboard.tsx";
import {PageCharlie} from "./pages/pageCharlie.tsx";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/pageCharlie" element={<PageCharlie />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
