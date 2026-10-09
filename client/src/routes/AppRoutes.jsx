import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import App from "../App";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import CitizenDashboard from "../pages/dashboard/CitizenDashboard";
import ReportIssue from "../pages/citizen/ReportIssue";
import MyComplaints from "../pages/citizen/MyComplaints";
import ComplaintDetails from "../pages/citizen/ComplaintDetails";
import Profile from "../pages/citizen/Profile";
import Settings from "../pages/citizen/Settings";

import StaffDashboard from "../pages/staff/StaffDashboard";

import AdminDashboard from "../pages/admin/AdminDashboard";

import ProtectedRoute from "./ProtectedRoute";


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* =========================
            PUBLIC ROUTES
        ========================== */}

                <Route
                    path="/"
                    element={<App />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =========================
            AUTHENTICATED ROUTES
        ========================== */}

                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<CitizenDashboard />}
                    />

                    <Route
                        path="/report"
                        element={<ReportIssue />}
                    />

                    <Route
                        path="/complaints"
                        element={<MyComplaints />}
                    />

                    <Route
                        path="/complaints/:complaintId"
                        element={<ComplaintDetails />}
                    />

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                    <Route
                        path="/settings"
                        element={<Settings />}
                    />

                </Route>


                {/* =========================
            STAFF ROUTES
        ========================== */}

                <Route
                    element={
                        <ProtectedRoute allowedRoles={["staff"]} />
                    }
                >
                    <Route
                        path="/staff-dashboard"
                        element={<StaffDashboard />}
                    />
                </Route>


                {/* =========================
            ADMIN ROUTES
        ========================== */}

                <Route
                    element={
                        <ProtectedRoute allowedRoles={["admin"]} />
                    }
                >
                    <Route
                        path="/admin-dashboard"
                        element={<AdminDashboard />}
                    />
                </Route>


                {/* =========================
            404 FALLBACK
        ========================== */}

                <Route
                    path="*"
                    element={<h1>404 - Page Not Found</h1>}
                />

            </Routes>
        </BrowserRouter>
    );
};


export default AppRoutes;