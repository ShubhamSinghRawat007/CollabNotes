import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import NotePage from "./pages/NotePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {

  const isMaintenance =
    import.meta.env.VITE_MAINTENANCE_MODE == "true";

  // ====================================
  // GLOBAL ACTIVE KEY
  // ====================================

  const [noteKey, setNoteKey] = useState("");

  // ====================================
  // LOAD SESSION KEY
  // ====================================

  useEffect(() => {

    const savedKey =
      sessionStorage.getItem("active_note_key");

    if (savedKey) {
      setNoteKey(savedKey);
    }

  }, []);

  // ====================================
  // UPDATE KEY
  // ====================================

  const updateKey = (newKey) => {

    setNoteKey(newKey);

    sessionStorage.setItem(
      "active_note_key",
      newKey
    );
  };

  if (isMaintenance) {

    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-gray-800">

        <h1 className="text-3xl font-bold mb-4">
          🚧 Site Under Maintenance
        </h1>

        <p className="text-lg">
          We’ll be back shortly!
        </p>

      </div>
    );
  }

  return (

    <BrowserRouter>

      <div className="flex flex-col min-h-screen bg-gray-50">

        <Header
          noteKey={noteKey}
          setNoteKey={updateKey}
        />

        <main className="flex-grow container mx-auto px-4 py-8">

          <AnimatePresence mode="wait">

            <Routes>

              <Route
                path="/"
                element={<HomePage />}
              />

              <Route
                path="/note/:id"
                element={
                  <NotePage
                    noteKey={noteKey}
                  />
                }
              />

              <Route
                path="*"
                element={<NotFoundPage />}
              />

            </Routes>

          </AnimatePresence>

        </main>

        <Footer />

      </div>

    </BrowserRouter>
  );
}

export default App;