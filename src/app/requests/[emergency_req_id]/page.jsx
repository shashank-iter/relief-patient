"use client";
import RequestDetailsPage from "@/components/RequestDeatilsPage";
import { clientGet, clientPost } from "@/utils/clientApi";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

export default function RequestDetails({ params }) {
  const [requestData, setRequestData] = useState(null);
  const intervalRef = useRef(null);

  const getRequestDetails = async () => {
    try {
      const response = await clientGet("/emergency/patient/get_hospital_responses");
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

    // Set up polling every 5 seconds
    intervalRef.current = setInterval(() => {
      getRequestDetails();
    }, 15000);

    // Cleanup interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {requestData && <RequestDetailsPage requestData={requestData} refreshRequest={getRequestDetails} />}
    </main>
  );
}