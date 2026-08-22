"use client";

import "./globals.css";
import LiquidCursor from "./LiquidCursor";
import NavBar from "./NavBar";
import { ReactLenis } from "lenis/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="...">
        <LiquidCursor />
        {/* <NavBar />  <-- DELETE OR COMMENT OUT THIS LINE */}
        <ReactLenis root>
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}