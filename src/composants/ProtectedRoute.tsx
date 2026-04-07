import { Navigate, Outlet } from "react-router-dom";
import { UserAuth } from "../context/AuthContext.tsx";

export const ProtectedRoute = () => {
    const { session, loading } = UserAuth();
    if (loading) {
        return <div style={{ padding: '20px' }}>Chargement de votre session...</div>;
    }
    if (!session) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};