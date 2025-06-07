import "./globals.css";
import BottomNavigation from "@/components/BottomNavigation";
import TopNavigation from "@/components/TopNavigation";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "Relief Patient",
  description: "Your one tap emerygency care. Tap for relief.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SpeedInsights />
      <body className={""}>
        <div className="max-w-md mx-auto h-screen">
          <Toaster position="top-center" />
          <TopNavigation />
          {children}
          <BottomNavigation />
        </div>
      </body>
    </html>
  );
}
