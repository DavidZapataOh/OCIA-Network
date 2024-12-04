'use client';

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import MainContent from "@/components/dashboard/MainContent";


export default function Dashboard() {
  return (
    <div className="flex bg-background min-h-screen text-secondary font-sans">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <MainContent />
      </div>
    </div>
  );
}
