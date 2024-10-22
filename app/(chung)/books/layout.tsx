"use client"
import React from "react";
import { Navbar } from "../_components/navbar";

const DashboardLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <Navbar />
      </div>
      <div className="flex flex-1 bg-gray-100/80">
        <main className="flex-1 p-6 ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
