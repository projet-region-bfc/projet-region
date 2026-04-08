import { Routes, Route, Navigate, Outlet, HashRouter } from "react-router-dom";


import { Login } from "./pages/login.tsx";
import { Signup } from "./pages/signup.tsx";
import { Dashboard } from "./pages/dashboard.tsx";
import { Questionnaire } from "./pages/Questionnaire.tsx";
import { Catalogue } from './pages/Catalogue.tsx';
import { ResultatChart } from "./pages/Resultat.tsx";


import { Menu } from "./composants/Menu.tsx";
import Header from '../src/composants/header.tsx';
import { ProtectedRoute } from "./composants/ProtectedRoute.tsx";


import { UserAuth } from "./context/AuthContext.tsx";


import './style/page.css';
import './header.css';
import {Formations} from "./pages/Formations.tsx";



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
    const auth = UserAuth();
    const session = auth?.session;

    return (
        <div className="App">
            <HashRouter>
                <Routes>
                    <Route path="/login" element={session ? <Navigate to="/dashboard" replace /> : <Login />} />
                    <Route path="/signup" element={session ? <Navigate to="/dashboard" replace /> : <Signup />} />
                    <Route element={<ProtectedRoute />}>
                        <Route element={<LayoutAvecMenu />}>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard/>}/>
                            <Route path="/questionnaire" element={<Questionnaire/>}/>
                            <Route path="/catalogue" element={<Catalogue/>}/>
                            <Route path="/resultat" element={<ResultatChart data={[]} nomEquipe="Test" />}/>
                            <Route path="/catalogue/:slug" element={<Formations />}/>
                        </Route>
                    </Route>
                </Routes>
            </HashRouter>
        </div>
    )
}

export default App;