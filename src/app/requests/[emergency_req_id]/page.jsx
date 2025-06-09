"use client";
import RequestDetailsPage from "@/components/RequestDeatilsPage";
import { clientGet, clientPost } from "@/utils/clientApi";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export default function RequestDetails() {
  const [requestData, setRequestData] = useState(null);
  const intervalRef = useRef(null);
  const pathname = usePathname();

  const getRequestDetails = async () => {
    try {
      // Extract the ID from the URL pathname
      const requestId = pathname.split('/').pop();
      const response = await clientGet(`/emergency/patient/get_hospital_responses/${requestId}/`);
      console.log(response);
      setRequestData(response.data);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    // Initial fetch
    getRequestDetails();

    // Set up polling every 15 seconds
    intervalRef.current = setInterval(() => {
      getRequestDetails();
    }, 15000);

    // Cleanup interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pathname]); // Add pathname to dependency array

  return (
    <main className="min-h-screen bg-gray-50">
      {requestData && <RequestDetailsPage requestData={requestData} refreshRequest={getRequestDetails} />}
    </main>
  );
}