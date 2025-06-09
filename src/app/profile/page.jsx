"use client";
import { useState, useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  MapPin,
  Phone,
  User,
  Calendar,
  CreditCard,
  AlertTriangle,
  Activity,
  LigatureIcon as Bandage,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Cookies from "js-cookie";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { clientGet } from "@/utils/clientApi";
import { Button } from "@/components/ui/button";
import { withAuth } from "@/components/withAuth";
import Loader from "@/components/Loader";
function PatientProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const Router = useRouter();

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await clientGet("/users/patient/profile");
      console.log(response);
      setProfile(response?.data);
    } catch (err) {
      console.log("Something went wrong", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);
  // Remove duplicate entries by using a Set with stringified objects
  const uniqueAllergies = Array.from(
    new Set(
      profile?.medicalHistory?.allergies.map((allergy) =>
        JSON.stringify({
          reason: allergy?.reason,
          symptoms: allergy?.symptoms,
          medication: allergy?.medication,
        })
      )
    )
  ).map((str) => JSON.parse(str));

  const uniqueInjuries = Array.from(
    new Set(
      profile?.medicalHistory?.injuries.map((injury) =>
        JSON.stringify({
          body_part: injury?.body_part,
          surgery: injury?.surgery,
          stitches: injury?.stitches,
          recovered: injury?.recovered,
          injury_year: injury?.injury_year,
          surgery_year: injury?.surgery_year,
        })
      )
    )
  ).map((str) => JSON.parse(str));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center">
        <Loader />
      </div>
    );
  }

  return (
    profile && (
      <div className="container mx-auto py-6 px-4 max-w-5xl mb-16">
        {/* Emergency Alert Banner */}
        {/* <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md flex items-center">
          <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
          <div>
            <h2 className="text-lg font-semibold text-red-800">
              Emergency Patient Profile
            </h2>
            <p className="text-red-700">
              Critical medical information for emergency response
            </p>
          </div>
        </div> */}

        {/* Patient Identity Card */}
        <Card className="mb-6 border-l-4 border-l-emerald-500 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold">
                  {profile?.name || "Relief User"}
                </CardTitle>
                {/* <CardDescription className="flex items-center mt-1">
                  <User className="h-4 w-4 mr-1" />
                  ID: {profile?._id.substring(0, 8)}...
                </CardDescription> */}
              </div>
              <Badge className="bg-red-500 hover:bg-red-600">
                {profile?.bloodGroup || "N/A"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-700 font-medium">Age:</span>
                  <span className="ml-2">
                    {profile?.age} years ({formatDate(profile?.dob)})
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-700 font-medium">Phone:</span>
                  <span className="ml-2">{profile?.phoneNumber}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-700 font-medium">Aadhar:</span>
                  <span className="ml-2">{profile?.aadharNumber || "N/A"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                  <div>
                    <span className="text-gray-700 font-medium">Address:</span>
                    <address className="ml-2 not-italic">
                      {profile?.address?.locality}, {profile?.address?.city}
                      <br />
                      {profile?.address?.state} - {profile?.address?.pincode}
                    </address>
                  </div>
                </div>
              </div>
              <div
                className="flex justify-end items-center w-full gap-x-2"
                // onClick={() => Router.push("/profile/edit")}
              >
                <Button
                  className="mt-4"
                  onClick={() => {
                    Router.push("/profile/edit");
                  }}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="mt-4 "
                  onClick={() => {
                    Cookies.remove("is_login");
                    Router.push("/auth/login");
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="mb-6 border-l-4 border-l-red-500 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.emergencyContacts?.map((contact, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center justify-between mb-5"
              >
                <div>
                  <p className="font-medium">
                    {contact?.name}{" "}
                    <span className="text-gray-500">
                      ({contact?.relationship})
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">{contact?.email}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <a
                    href={`tel:${contact?.phoneNumber}`}
                    className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {contact?.phoneNumber}
                  </a>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Medical Information Tabs */}
        <Tabs defaultValue="diseases" className="mb-16">
          <TabsList className="grid grid-cols-3 mb-4 mx-auto">
            <TabsTrigger value="diseases" className="flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Diseases
            </TabsTrigger>
            <TabsTrigger value="allergies" className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Allergies
            </TabsTrigger>
            <TabsTrigger value="injuries" className="flex items-center">
              <Bandage className="h-4 w-4 mr-2" />
              Injuries
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diseases">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Current Medical Conditions
                </CardTitle>
                <CardDescription>
                  Active diseases and ongoing treatments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profile?.medicalHistory?.diseases.length > 0 ? (
                  <div className="space-y-4">
                    {profile?.medicalHistory?.diseases.map((disease, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-amber-400 pl-4 py-2"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-lg">
                            {disease?.name}
                          </h3>
                          <Badge
                            variant={
                              disease?.status === "current"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {disease?.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Since:</span>{" "}
                          {formatDate(disease?.from)}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Medication:</span>{" "}
                          {disease?.medication}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No diseases recorded</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="allergies">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Allergies</CardTitle>
                <CardDescription>
                  Known allergic reactions and treatments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uniqueAllergies.length > 0 ? (
                  <div className="space-y-4">
                    {uniqueAllergies.map((allergy, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-red-400 pl-4 py-2"
                      >
                        <h3 className="font-medium text-lg">
                          {allergy?.reason}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Symptoms:</span>{" "}
                          {allergy?.symptoms}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Treatment:</span>{" "}
                          {allergy?.medication}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No allergies recorded</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="injuries">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Past Injuries</CardTitle>
                <CardDescription>
                  Previous injuries and surgical history
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uniqueInjuries.length > 0 ? (
                  <div className="space-y-4">
                    {uniqueInjuries.map((injury, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-blue-400 pl-4 py-2"
                      >
                        <h3 className="font-medium text-lg">
                          {injury?.body_part} Injury ({injury?.injury_year})
                        </h3>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="flex items-center">
                            <Badge
                              variant={injury?.surgery ? "default" : "outline"}
                              className="mr-2"
                            >
                              {injury?.surgery ? "Surgery" : "No Surgery"}
                            </Badge>
                            {injury?.surgery && (
                              <span className="text-xs text-gray-500">
                                ({injury?.surgery_year})
                              </span>
                            )}
                          </div>
                          <Badge
                            variant={injury?.stitches ? "default" : "outline"}
                          >
                            {injury?.stitches
                              ? "Required Stitches"
                              : "No Stitches"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Status:</span>{" "}
                          {injury?.recovered
                            ? "Fully Recovered"
                            : "Not Fully Recovered"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No injuries recorded</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  );
}

export default withAuth(PatientProfile);
