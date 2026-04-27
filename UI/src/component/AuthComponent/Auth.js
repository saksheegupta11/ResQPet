import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react'; 

function Auth() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        const role = localStorage.getItem("role");
        const token = localStorage.getItem("token");

        // Protected Admin Routes
        const adminRoutes = ["/admin", "/epadmin", "/cpadmin", "/managengo"];
        if (adminRoutes.includes(path)) {
            if (!token || role !== "admin") {
                navigate("/logout");
            }
            return;
        }

        // Protected NGO Routes
        const ngoRoutes = ["/ngo", "/epngo", "/cpngo"];
        if (ngoRoutes.includes(path)) {
            if (!token || role !== "ngo") {
                navigate("/logout");
            }
            return;
        }

        // Shared Protected Routes (Accessible by both Admin and NGO)
        const sharedRoutes = ["/managereq"];
        if (sharedRoutes.includes(path)) {
            if (!token || (role !== "admin" && role !== "ngo")) {
                navigate("/logout");
            }
            return;
        }

        // Redirect logged-in users away from auth pages
        const authRoutes = ["/login", "/register"];
        if (authRoutes.includes(path) && token) {
            if (role === "admin") navigate("/admin");
            else if (role === "ngo") navigate("/ngo");
        }

    }, [location.pathname, navigate]);
    
    return null;
}

export default Auth;