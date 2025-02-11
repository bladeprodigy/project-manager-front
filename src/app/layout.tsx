import './globals.css';
import NavBar from "@/components/NavBar";
import React from "react";

export const metadata = {
  title: 'Project Manager',
  description: 'Manage your projects and users',
};

export default function RootLayout({children}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
      <body>
      <NavBar/>
      <main>{children}</main>
      </body>
      </html>
  );
}
