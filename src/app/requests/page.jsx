"use client";
import { useState, useEffect } from "react";
import RequestsPage from "@/components/RequestPage";

// Mock data for requests list
const getRequests = () => {
  return [
    {
      _id: "6844aea7660042c582c83f04",
      patientName: "John Doe",
      status: "accepted",
      createdAt: "2025-06-07T21:27:03.743Z",
      forSelf: true,
      patientPhoneNumber: "+1234567890",
    },
    {
      _id: "6844aea7660042c582c83f05",
      patientName: "Jane Smith",
      status: "pending",
      createdAt: "2025-06-07T20:15:30.123Z",
      forSelf: false,
      patientPhoneNumber: "+1234567891",
    },
    {
      _id: "6844aea7660042c582c83f06",
      patientName: "Mike Johnson",
      status: "finalized",
      createdAt: "2025-06-07T19:45:12.456Z",
      forSelf: true,
      patientPhoneNumber: "+1234567892",
    },
    {
      _id: "6844aea7660042c582c83f07",
      patientName: "Sarah Wilson",
      status: "resolved",
      createdAt: "2025-06-07T18:30:45.789Z",
      forSelf: false,
      patientPhoneNumber: "+1234567893",
    },
    {
      _id: "6844aea7660042c582c83f08",
      patientName: "David Brown",
      status: "cancelled",
      createdAt: "2025-06-07T17:20:15.321Z",
      forSelf: true,
      patientPhoneNumber: "+1234567894",
    },
    {
      _id: "6844aea7660042c582c83f09",
      patientName: "Emily Davis",
      status: "pending",
      createdAt: "2025-06-07T16:10:30.654Z",
      forSelf: false,
      patientPhoneNumber: "+1234567895",
    },
  ];
};

export default function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = () => {
      const data = getRequests();
      setRequests(data);
    };

    fetchRequests();
  }, []);

  return <RequestsPage requests={requests} />;
}
