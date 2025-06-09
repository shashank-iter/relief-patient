"use client";
import { useState, useEffect } from "react";
import RequestsPage from "@/components/RequestPage";
import { toast } from "sonner";
import { clientPost } from "@/utils/clientApi";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("pending");
  const [loading, setIsLoading] = useState(false);

  const fetchRequestsByStatus = async (status) => {
    try {
      setIsLoading(true);
      const response = await clientPost(
        `/emergency/patient/get_emergency_requests_by_status`,
        {
          status: status,
        }
      );
      console.log(response);
      setRequests(response.data);
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestsByStatus(status);
  }, [status]);

  return (
    <RequestsPage requests={requests} status={status} setStatus={setStatus} loading={loading} />
  );
}
