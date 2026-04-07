import { Navigate, Outlet } from "react-router-dom";
import { UserAuth } from "../context/AuthContext.tsx";

export const ProtectedRoute = () => {
    const { session } = UserAuth();

    if (session === undefined) {
        return <p>Vérification de l'accès...</p>;
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};