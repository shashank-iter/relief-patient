"use client";
import { useEffect } from "react";
import { withAuth } from "@/components/withAuth";
import EmergencyHomePage from "@/components/EmergencyHomePage";
function Home() {
  useEffect(() => {}, []);
  return (
    <div className="pb-16">
      <EmergencyHomePage />
    </div>
  );
}

export default withAuth(Home);
