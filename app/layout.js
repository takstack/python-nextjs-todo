'use client'
import React from "react";
import "./globals.css";
import { GlobalProvider } from "./hooks/useGlobalContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-blue-500 text-white">
        <GlobalProvider>
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
