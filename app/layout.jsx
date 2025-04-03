import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/context-api/GlobalProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SecureVault - Password Manager",
  description: "A secure and user-friendly password manager",
  generator: "v0.dev",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={inter.className}>
        <GlobalProvider>
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
