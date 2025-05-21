"use client";
import { MdHome, MdEmergencyShare, MdDiversity3 } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import Link from "next/link";

const navigation = [
  {
    id: 1,
    name: "Home",
    href: "/",
    icon: MdHome,
  },
  {
    id: 2,
    name: "Requests",
    href: "/requests",
    icon: MdEmergencyShare,
  },
  {
    id: 3,
    name: "Profile",
    href: "/profile",
    icon: CiUser,
  },
];

export default function BottomNavigation() {
  return (
    <div className="fixed bottom-0 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 max-w-md mx-auto">
      <div className="flex items-center justify-between max-w-screen-xl px-4 mx-auto h-full">
        {navigation.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex flex-col items-center text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 "
          >
            <item.icon className="w-6 h-6" />
            <div className="text-xs md:text-sm font-medium">{item.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
