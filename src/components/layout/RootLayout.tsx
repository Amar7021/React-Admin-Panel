import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import LoadingBar from "react-top-loading-bar"

const RootLayout = () => {
    const location = useLocation()
    const loadingBarRef = useRef<any>(null)

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

    return <>
        <LoadingBar
            color="var(--color-purple-600)"
            ref={loadingBarRef}
            shadow={true}
        />
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex-1 min-w-0 flex flex-col">
                <Navbar />
                <Outlet />
            </div>
        </div>
    </>
}

export default RootLayout