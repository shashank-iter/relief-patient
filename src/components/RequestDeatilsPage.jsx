"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Calendar,
  User,
  Ambulance,
  Building2,
  Bed,
  Droplets,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  X,
  Loader2,
  Navigation,
} from "lucide-react";
import { toast } from "sonner";
import { clientPost, clientPostFormData } from "@/utils/clientApi";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  accepted: "bg-blue-100 text-blue-800 border-blue-200",
  finalized: "bg-purple-100 text-purple-800 border-purple-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const bloodGroupLabels = {
  opos: "O+",
  oneg: "O-",
  apos: "A+",
  aneg: "A-",
  bpos: "B+",
  bneg: "B-",
  abpos: "AB+",
  abneg: "AB-",
};

export default function RequestDetailsPage({ requestData, refreshRequest }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const router = useRouter();
  const { request } = requestData;
  console.log("request", request);

  const calculateDistance = (coords1, coords2) => {
    // Simple distance calculation (in a real app, you'd use a proper geolocation library)
    const dx = coords1[0] - coords2[0];
    const dy = coords1[1] - coords2[1];
    return Math.sqrt(dx * dx + dy * dy) * 111; // Rough conversion to km
  };

  const handleNavigateToHospital = (hospital) => {
    if (hospital?.location?.coordinates?.length > 0) {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hospital.location.coordinates[0]},${hospital.location.coordinates[1]}&travelmode=driving`;
      window.open(googleMapsUrl, "_blank");
    } else {
      toast.error("Hospital coordinates not available");
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("emergencyRequestId", request._id);

      const response = await clientPostFormData(
        "/emergency/patient/upload_emergency_request_photo",
        formData
      );
      console.log(response);
      toast.success("Emergency image uploaded successfully");
      refreshRequest();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  const handleFinalizeHospital = async (hospitalId, hospitalName) => {
    setIsLoading(true);
    try {
      const response = await clientPost(
        `/emergency/patient/finalize_emergency_request/${request?._id}`,
        {
          hospitalId: hospitalId,
        }
      );
      console.log(response);
      toast.success(
        `${hospitalName} has been finalized for this emergency request.`
      );

      refreshRequest();
    } catch (error) {
      toast.error("Failed to finalize hospital. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    setIsLoading(true);
    try {
      const response = await clientPost(
        `/emergency/patient/cancel_emergency_request/${requestId}`
      );

      console.log(response);

      toast.success("The emergency request has been cancelled successfully.");

      router.push("/requests");
    } catch (error) {
      toast.error("Failed to cancel request. Please try again.");
    } finally {
      setIsLoading(false);
      setCancelModalOpen(false);
    }
  };

  const renderImageUploadSection = () => {
    if (request?.photo) {
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Emergency Image</Label>
          <div className="flex flex-col space-y-2 items-start space-x-2">
            <Badge
              variant="outline"
              className="text-green-700 border-green-300"
            >
              <ImageIcon className="h-3 w-3 mr-1" />
              Emergency Image Uploaded
            </Badge>
            <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Click to view image
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Emergency Image</DialogTitle>
                </DialogHeader>
                <div className="relative">
                  <img
                    src={request?.photo}
                    alt="Emergency scene"
                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      );
    }

    if (isUploading) {
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Emergency Image</Label>
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              Uploading image...
            </Badge>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Label htmlFor="emergency-image" className="text-sm font-medium">
          Upload Emergency Image
        </Label>
        <div className="flex flex-col space-y-2 items-center space-x-2">
          <Input
            id="emergency-image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("emergency-image").click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose Image
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
        </p>
      </div>
    );
  };

  const renderHospitalCard = (hospital, showFinalizeButton = false) => (
    <Card
      key={hospital?._id}
      className={`border-l-4 ${
        request?.status === "finalized"
          ? "border-l-purple-500"
          : "border-l-blue-500"
      }`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-y-2 justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">
              {hospital?.name}
              {request?.status === "finalized" && (
                <Badge className="ml-2 bg-purple-100 text-purple-800 border-purple-200">
                  Finalized Hospital
                </Badge>
              )}
            </h3>
            <p className="text-gray-600">{hospital?.type?.replace("_", " ")}</p>
            <p className="text-sm text-gray-500">
              License: {hospital?.licenseNumber}
            </p>
          </div>
          {showFinalizeButton && (
            <Button
              onClick={() =>
                handleFinalizeHospital(hospital?._id, hospital?.name)
              }
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Finalize Hospital
            </Button>
          )}
        </div>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="beds">Beds</TabsTrigger>
            <TabsTrigger value="blood">Blood</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Address
                </h4>
                <p className="text-sm text-gray-600">
                  {hospital?.address?.locality}, {hospital?.address?.city}
                  <br />
                  {hospital?.address?.state} - {hospital?.address?.pincode}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Services</h4>
                <div className="space-y-2">
                  <Badge
                    variant={
                      hospital?.is_ambulance_available ? "default" : "secondary"
                    }
                    className="mr-2"
                  >
                    <Ambulance className="h-3 w-3 mr-1" />
                    {hospital?.is_ambulance_available
                      ? "Ambulance Available"
                      : "No Ambulance"}
                  </Badge>
                  <Badge
                    variant={
                      hospital?.is_blood_available ? "default" : "secondary"
                    }
                  >
                    <Droplets className="h-3 w-3 mr-1" />
                    {hospital?.is_blood_available
                      ? "Blood Bank Available"
                      : "No Blood Bank"}
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="beds">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hospital?.bedData?.map((bed, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium flex items-center">
                      <Bed className="h-4 w-4 mr-2" />
                      {bed?.type} Beds
                    </h4>
                    <Badge
                      variant={bed?.available > 0 ? "default" : "secondary"}
                    >
                      {bed?.available > 0 ? "Available" : "Full"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Available: {bed?.available} / {bed?.count}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(bed?.available / bed?.count) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="blood">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hospital?.bloodData &&
                Object.entries(hospital?.bloodData)?.map(([type, count]) => {
                  if (
                    type.startsWith("_") ||
                    type === "owner" ||
                    type === "updatedAt" ||
                    type === "createdAt"
                  )
                    return null;
                  return (
                    <div
                      key={type}
                      className="border rounded-lg p-3 text-center"
                    >
                      <div className="flex items-center justify-center mb-2">
                        <Droplets className="h-4 w-4 mr-1 text-red-500" />
                        <span className="font-medium">
                          {bloodGroupLabels[type]}
                        </span>
                      </div>
                      <p className="text-lg font-bold">{count}</p>
                      <p className="text-xs text-gray-500">units</p>
                    </div>
                  );
                })}
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="space-y-4">
              <h4 className="font-medium">Phone Numbers</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hospital?.phoneNumbers?.map((phone) => (
                  <div
                    key={phone?._id}
                    className="flex items-center justify-between border rounded-lg p-3"
                  >
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <div>
                        <p className="font-medium">{phone?.number}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {phone?.label}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        (window.location.href = `tel:${phone?.number}`)
                      }
                    >
                      Call
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Navigate to Hospital Button */}
        {(request?.status === "finalized" ||
          request?.status === "accepted") && (
          <div className="mt-4 pt-4 border-t">
            <Button
              onClick={() => handleNavigateToHospital(hospital)}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Navigation className="h-5 w-5 mr-2" />
              Navigate to Hospital
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Get hospitals to display based on status
  const getHospitalsToDisplay = () => {
    if (request?.status === "finalized" && request?.finalizedHospital) {
      // Show only the finalized hospital
      return [request.finalizedHospital];
    }
    // Show all accepted hospitals for other statuses
    return request?.acceptedBy || [];
  };

  const hospitalsToDisplay = getHospitalsToDisplay();

  return (
    <div className="container mx-auto pt-6 pb-24 px-4 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col items-start justify-between mb-6 space-y-4">
        <div className="flex flex-col items-start space-x-4 space-y-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Requests
            </Button>
            {/* Cancel Request Button in Header */}
            {request?.status !== "cancelled" &&
              request?.status !== "resolved" && (
                <Dialog
                  open={cancelModalOpen}
                  onOpenChange={setCancelModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center text-red-600">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Cancel Emergency Request
                      </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-gray-700 mb-4">
                        Are you sure you want to cancel this emergency request?
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 font-medium">
                          ⚠️ Warning: No help will arrive if this request is
                          cancelled.
                        </p>
                        <p className="text-red-700 text-sm mt-1">
                          This action cannot be undone and all hospitals will be
                          notified of the cancellation.
                        </p>
                      </div>
                    </div>
                    <DialogFooter className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCancelModalOpen(false)}
                        disabled={isLoading}
                      >
                        No, don't cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleCancelRequest(request?._id)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Yes, cancel it
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
          </div>
          <div className="flex flex-col gap-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Emergency Request Details
            </h1>
            <p className="text-gray-600 mt-1">Request ID: {request?._id}</p>
          </div>
        </div>
        <Badge
          className={
            statusColors[request?.status] || "bg-gray-100 text-gray-800"
          }
        >
          {request?.status.toUpperCase()}
        </Badge>
      </div>

      {/* Request Overview */}
      <Card className="mb-6 border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            Emergency Request Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Patient</p>
                <p className="font-medium">{request?.patientName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{request?.patientPhoneNumber}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="font-medium">{formatDate(request?.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Ambulance className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Ambulance</p>
                <p className="font-medium">
                  {request?.is_ambulance_required ? "Required" : "Not Required"}
                </p>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="border-t pt-4">{renderImageUploadSection()}</div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {request?.status === "accepted" && !request?.finalizedHospital && (
        <Card className="mb-6 bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">Action Required</p>
                  <p className="text-sm text-amber-700">
                    Please finalize a hospital or cancel the request.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hospital(s) Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            {request?.status === "finalized"
              ? `Finalized Hospital`
              : `Accepted Hospitals (${hospitalsToDisplay.length})`}
          </CardTitle>
          <CardDescription>
            {request?.status === "finalized"
              ? "The hospital finalized for this emergency request"
              : "Hospitals that have accepted this emergency request"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hospitalsToDisplay.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No hospitals have accepted this request yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {hospitalsToDisplay?.map((hospital) =>
                renderHospitalCard(
                  hospital,
                  request?.status === "accepted" && !request?.finalizedHospital
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
