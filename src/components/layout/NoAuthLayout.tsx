import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import LoadingBar from "react-top-loading-bar"
import { useAuthStore } from "@/store/authStore";

const NoAuthLayout = () => {
    const location = useLocation()
    const loadingBarRef = useRef<any>(null)
    const { currentUser } = useAuthStore();

    useEffect(() => {
        const loadingBar = loadingBarRef.current
        loadingBar?.continuousStart()
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });

        const timer = setTimeout(() => {
            loadingBar?.complete()
        }, 500)

        return () => {
            clearTimeout(timer)
        }
    }, [location.pathname])

    if (currentUser) {
        return <Navigate to="/" replace />
    }

    return <>
        <LoadingBar
            color="var(--color-purple-600)"
            ref={loadingBarRef}
            shadow={true}
        />
        <div className="flex min-h-screen bg-background w-full items-center justify-center">
            <Outlet />
        </div>
    </>
}

export default NoAuthLayout