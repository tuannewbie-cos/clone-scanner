import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ProfileScanner from "./features/profile-scanner/ProfileScanner";
import BlacklistManager from "./features/blacklist/BlacklistManager";
import { checkBackendStatus } from "./features/profile-scanner/services/scannerApi";

export default function App() {
  const [activeTab, setActiveTab] = useState("scanner");
  const [backendStatus, setBackendStatus] = useState({ online: false, mockMode: true });

  useEffect(() => {
    async function loadStatus() {
      const status = await checkBackendStatus();
      setBackendStatus(status);
    }
    loadStatus();

    // Định kỳ ping nhẹ backend
    const interval = setInterval(loadStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-[580px] bg-slate-950 text-slate-100">
      {/* Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === "scanner" && <ProfileScanner />}
        {activeTab === "blacklist" && <BlacklistManager />}
      </main>

      {/* Footer */}
      <footer className="mt-auto px-4 py-2 border-t border-slate-900 bg-slate-950/90 text-center text-[10px] text-slate-500">
        SocialScam Detector v1.0 • Phòng chống lừa đảo mạng xã hội
      </footer>
    </div>
  );
}
