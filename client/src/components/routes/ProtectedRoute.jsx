import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function AuthLoadingScreen() {
  return (
    <div className="nura-page flex min-h-screen items-center justify-center text-[#542B35]">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E77D91] opacity-35" />
          <span className="relative inline-flex h-10 w-10 rounded-full bg-gradient-to-br from-[#E77D91] to-[#A83D55] shadow-md" />
        </div>
        <p className="font-serif text-lg font-medium text-[#542B35]">
          nura
        </p>
        <p className="text-xs text-[#806B68]">
          Connecting with your wellness space...
        </p>
      </div>
    </div>
  );
}

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
