import "./globals.css";
import BottomNavigation from "@/components/BottomNavigation";
import TopNavigation from "@/components/TopNavigation";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Relief Patient",
  description: "Your one tap emerygency care. Tap for relief.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={""}>
        <div className="max-w-md mx-auto h-screen">
          <Toaster />
          <TopNavigation />
          {children}
          <BottomNavigation />
        </div>
      </body>
    </html>
  );
}
