import "./globals.css";
import BottomNavigation from "@/components/BottomNavigation";
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
          {children}
          <BottomNavigation />
         
        </div>
      </body>
    </html>
  );
}
