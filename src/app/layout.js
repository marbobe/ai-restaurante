import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/**
 * GOOGLE FONTS CONFIGURATION
 * * Next.js automatically optimizes fonts by downloading them at build time.
 * We use Geist Sans for general UI and Geist Mono for code-like or technical elements.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * GLOBAL METADATA
 * * Used for SEO and browser tab configuration. Next.js injects these 
 * into the <head> of the document automatically.
 * * @type {import("next").Metadata}
 */
export const metadata = {
  title: "RestaurIAnte",
  description: "Encuentra el lugar perfecto para comer usando inteligencia artificial.",
  icons: { icon: "/icon.svg" }
};

/**
 * ROOT LAYOUT COMPONENT
 * * This is the top-level wrapper for the entire application. 
 * Everything rendered in 'page.js' will be injected into the {children} prop.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The specific page content to be rendered.
 * @returns {JSX.Element} The HTML skeleton of the application.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
