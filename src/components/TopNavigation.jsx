import React from "react";
import { UserCircleIcon } from "lucide-react";
function TopNavigation() {
  return (
    <div className="w-full py-2 flex items-center justify-between mb-5 mt-2 px-2">
      <div className="text-2xl font-semibold">Relief</div>
      <div>
        <UserCircleIcon className="w-8 h-8 text-blue-600" />
      </div>
    </div>
  );
}

export default TopNavigation;
