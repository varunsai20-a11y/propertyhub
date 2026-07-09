import { Route, Routes, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AuthModal } from "./components/AuthModal";
import { SavePromptModal } from "./components/SavePromptModal";
import { LandingPage } from "./pages/LandingPage";
import { ListingsPage } from "./pages/ListingsPage";
import { PropertyDetailPage } from "./pages/PropertyDetailPage";
import { DashboardPage } from "./pages/DashboardPage";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-full flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-md p-10 text-center">
                <h1 className="text-3xl font-extrabold text-brand-deep">
                  Page not found
                </h1>
                <p className="mt-2 text-brand-mute">
                  The page you're looking for doesn't exist.
                </p>
              </div>
            }
          />
        </Routes>
      </main>
      <AuthModal />
      <SavePromptModal />
    </div>
  );
}
