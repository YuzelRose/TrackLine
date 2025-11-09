import { Geist, Geist_Mono } from "next/font/google";
import Header from './components/layout/Header.js'
import Footer from './components/layout/Footer.js'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Line Track",
  description: "Created by YuzelRose",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  )
}

