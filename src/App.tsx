import {BrowserRouter, Routes, Route} from "react-router-dom";
// import './App.css'
import {Home} from "./pages/home.tsx";
import {Login} from "./pages/login.tsx";
import {Signup} from "./pages/signup.tsx";
import {Dashboard} from "./pages/dashboard.tsx";
import {Questionnaire} from "./pages/Questionnaire.tsx";
import { Menu } from "./composants/Menu.tsx";
import {Outlet} from "react-router-dom";
import {UserAuth} from "./context/AuthContext.tsx";
import Header from '../src/composants/header.tsx';
import './style/page.css';
import './header.css';


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

const HomeWrapper = () => {

  const { session } = UserAuth();

    if (session) {
        return (
            <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
                <Menu />
                <main className="main-content" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '0px' }}>
                    <Header />

                    <div style={{ padding: '20px', flexGrow: 1 }}>
                    <Home />
                    </div>
                </main>
            </div>
        );
    }
    return <Home />;
};

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/" element={<HomeWrapper />} />
                    <Route element={<LayoutAvecMenu />}>
                        <Route path="/dashboard" element={<Dashboard/>}/>
                        <Route path="/questionnaire" element={<Questionnaire/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;