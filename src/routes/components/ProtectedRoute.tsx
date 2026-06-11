import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const currentUser = useAuthStore((state) => state.currentUser);

    return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute