import { ResultatChart } from "./pages/Resultat.tsx";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
// import './App.css'
import {Login} from "./pages/login.tsx";
import {Signup} from "./pages/signup.tsx";
import {Dashboard} from "./pages/dashboard.tsx";
import {Questionnaire} from "./pages/Questionnaire.tsx";
import { Menu } from "./composants/Menu.tsx";
import {Formation} from './pages/Formation.tsx';
import {Outlet} from "react-router-dom";
import Header from '../src/composants/header.tsx';
import { ProtectedRoute } from "./composants/ProtectedRoute.tsx";
import './style/page.css';
import './header.css';
import { DashboardManager } from "./pages/DashboardManager.tsx";
import { DashboardAgent } from "./pages/DashboardAgent.tsx";



const LayoutAvecMenu = () => {


    return (
        <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
            <Menu />
            <main className="main-content" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>

                <Header />

                <div style={{ padding: '20px', flexGrow: 1 }}>
                    <Outlet />
                </div>

            </main>
        </div>
    );
};


function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route element={<ProtectedRoute />}>
                        <Route element={<LayoutAvecMenu />}>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard/>}/>
                            <Route path="/questionnaire" element={<Questionnaire/>}/>
                            <Route path="/formation" element={<Formation/>}/>
                            <Route path="/resultat" element={<ResultatChart data={[]} nomEquipe="Test" />}/>
                            <Route path="/DashboardManager" element={<DashboardManager/>}/>
                            <Route path="/DashboardAgent" element={<DashboardAgent />}/>
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;