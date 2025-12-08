import { NavBar } from "./components/NavBar";
import { ConsultationSection } from "./components/ConsultationSection";
import { WhoWeHelp } from "./components/WhoWeHelp";
import { Pricing } from "./components/Pricing";
import { AboutDoctor } from "./components/AboutDoctor";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";

import { BookingPage } from "./pages/BookingPage";
import { NaturalMedicineQuestionnaire } from "./pages/NaturalMedicineQuestionnaire";
import { WeightLossQuestionnaire } from "./pages/WeightLossQuestionnaire";
import { SmokingCessationQuestionnaire } from "./pages/SmokingCessationQuestionnaire";
import { SleepDisorderQuestionnaire } from "./pages/SleepDisorderQuestionnaire";
import { UserDetailsFlow } from "./pages/UserDetailsFlow";
import { AppointmentPage } from "./pages/AppointmentPage";
import { LoginPage } from "./pages/LoginPage";
import SuccessPage from "./pages/SuccessPage";
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Appointments from "./admin/Appointments";
import OffDays from "./admin/OffDays";
import Providers from "./admin/Providers";
import ProtectedRoute from "./admin/ProtectedRoute";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import MedicalCertificates from "./admin/MedicalCertificates";






import { Routes, Route } from "react-router-dom";

// ---------------- HOME PAGE ----------------
function HomePage() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <NavBar onNavClick={scrollToSection} />
      <ConsultationSection />
      <WhoWeHelp />
      <Pricing />
      <AboutDoctor />
      <FAQ />
      <Footer />
    </>
  );
}

// ---------------- ROUTES ----------------
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Booking Page */}
      <Route path="/booking" element={<BookingPage />} />

      {/* Questionnaires */}
      <Route
        path="/questionnaire/natural-medicine"
        element={<NaturalMedicineQuestionnaire />}
      />
      <Route
        path="/questionnaire/weight-loss"
        element={<WeightLossQuestionnaire />}
      />
      <Route
        path="/questionnaire/smoking-cessation"
        element={<SmokingCessationQuestionnaire />}
      />
      <Route
        path="/questionnaire/sleep"
        element={<SleepDisorderQuestionnaire />}
      />

      {/* User details → saves to DB */}
      <Route path="/user-details" element={<UserDetailsFlow />} />
      <Route path="/appointment" element={<AppointmentPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/success" element={<SuccessPage />} />

      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/appointments" element={
        <ProtectedRoute>
          <AdminLayout>
            <Appointments />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/off-days" element={
        <ProtectedRoute>
          <AdminLayout>
            <OffDays />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/providers" element={
        <ProtectedRoute>
          <AdminLayout>
            <Providers />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route
  path="/admin/medical-certificates"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <MedicalCertificates />
      </AdminLayout>
    </ProtectedRoute>
  }
/>



    </Routes>
  );
}
console.log("ENV CHECK:", import.meta.env.VITE_SUPABASE_URL);


export default App;
