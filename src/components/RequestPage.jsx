"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, User, Phone } from "lucide-react";
import Loader from "./Loader";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  accepted: "bg-blue-100 text-blue-800 border-blue-200",
  finalized: "bg-purple-100 text-purple-800 border-purple-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels = {
  pending: "Pending",
  accepted: "Accepted",
  finalized: "Finalized",
  resolved: "Resolved",
  cancelled: "Cancelled",
};

export default function RequestsPage({ requests, status, setStatus, loading }) {
  const router = useRouter();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleRequestClick = (requestId) => {
    router.push(`/requests/${requestId}`);
  };

  return (
    <div className="container mx-auto pt-6 pb-24 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col items-start space-x-4 space-y-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Emergency Requests
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and track emergency requests
            </p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex flex-col items-start justify-between space-y-4">
            <CardTitle className="text-lg">Filter Requests</CardTitle>
            <div className="flex items-center space-x-4 ">
              <span className="text-sm text-gray-600">Status:</span>
              <Select
                value={status}
                onValueChange={(e) => {
                  setStatus(e);
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="finalized">Finalized</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {requests?.length} {status === "pending" ? "pending" : status}{" "}
          request
          {requests?.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="mx-auto">
          <Loader />
        </div>
      ) : (
        <div className="space-y-4">
          {requests?.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Clock className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No requests found
                </h3>
                <p className="text-gray-600">
                  No {status === "pending" ? "pending" : status} requests at the
                  moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            requests?.map((request) => (
              <Card
                key={request?._id}
                className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
                onClick={() => handleRequestClick(request?._id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-end justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col items-start space-x-3 space-y-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request?.patientName}
                        </h3>
                        <div className="flex items-center gap-x-2">
                          <Badge className={statusColors[request?.status]}>
                            {statusLabels[request?.status]}
                          </Badge>
                          {request?.forSelf && (
                            <Badge variant="outline" className="text-xs">
                              Self
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-start space-y-2 space-x-6 text-sm text-gray-600">
                        {/* <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>ID: {request?._id.substring(0, 8)}...</span>
                      </div> */}
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{request?.patientPhoneNumber}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatDate(request?.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    {(request?.status === "pending" ||
                      request?.status === "accepted" ||
                      request?.status === "finalized") && (
                      <div className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleRequestClick(request?._id);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
