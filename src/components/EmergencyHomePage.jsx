"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  AlertTriangle,
  MapPin,
  Phone,
  Navigation,
  Clock,
  Star,
  Ambulance,
  User,
  CogIcon,
  InfoIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Mock hospital data - in a real app, this would come from an API
const mockHospitals = [
  {
    id: "1",
    name: "City General Hospital",
    address: "123 Main Street, Downtown",
    distance: 0.8,
    phone: "+91-9876543210",
    rating: 4.5,
    type: "government",
    emergencyServices: true,
    estimatedTime: 5,
  },
  {
    id: "2",
    name: "Apollo Emergency Center",
    address: "456 Health Avenue, Medical District",
    distance: 1.2,
    phone: "+91-9876543211",
    rating: 4.8,
    type: "private",
    emergencyServices: true,
    estimatedTime: 7,
  },
  {
    id: "3",
    name: "Metro Medical Complex",
    address: "789 Care Boulevard, Central Area",
    distance: 1.5,
    phone: "+91-9876543212",
    rating: 4.3,
    type: "private",
    emergencyServices: true,
    estimatedTime: 8,
  },
  {
    id: "4",
    name: "District Hospital",
    address: "321 Government Road, North Side",
    distance: 2.1,
    phone: "+91-9876543213",
    rating: 4.1,
    type: "government",
    emergencyServices: true,
    estimatedTime: 12,
  },
  {
    id: "5",
    name: "Sunrise Medical Center",
    address: "654 Wellness Street, East District",
    distance: 2.8,
    phone: "+91-9876543214",
    rating: 4.6,
    type: "private",
    emergencyServices: false,
    estimatedTime: 15,
  },
];

export default function EmergencyHomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName] = useState("Shashank"); // In a real app, this would come from user context
  const [userLocation, setUserLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const Router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleEmergencyReport = () => {
    toast.success("Emergency Alert Sent!", {
      description: "Your emergency has been reported. Help is on the way.",
    });

    // In a real app, this would trigger emergency protocols
    console.log("Emergency reported at:", new Date().toISOString());
  };

  const fetchNearbyHospitals = async () => {
    setIsLoadingLocation(true);

    try {
      // Simulate getting user location
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUserLocation("Gonda, Uttar Pradesh");

      // Simulate fetching nearby hospitals
      await new Promise((resolve) => setTimeout(resolve, 500));
      setHospitals(mockHospitals);

      toast.success("Location Found", {
        description: "Found nearby hospitals based on your location.",
      });
    } catch (error) {
      toast.error("Location Error", {
        description: "Unable to get your location. Showing default hospitals.",
      });
      setHospitals(mockHospitals);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleNavigateToHospital = (hospital) => {
    toast.success("Navigation Started", {
      description: `Navigating to ${hospital.name}`,
    });
    // In a real app, this would open maps navigation
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
      hospital.name + " " + hospital.address
    )}`;
    window.open(mapsUrl, "_blank");
  };

  const handleCallHospital = (hospital) => {
    window.location.href = `tel:${hospital.phone}`;
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Greeting Banner */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  {getGreeting()}, {userName}!
                </h1>
                <p className="text-blue-100 mt-1">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-blue-100 text-sm">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Ambulance className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Report Button */}
        <Button
          onClick={handleEmergencyReport}
          className="w-full h-20 text-lg font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <AlertTriangle className="h-8 w-8 mr-3" />
          REPORT EMERGENCY FOR SELF
        </Button>
        <Button
          onClick={handleEmergencyReport}
          className="w-full h-20 text-lg font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <AlertTriangle className="h-8 w-8 mr-3" />
          REPORT EMERGENCY FOR OTHER
        </Button>

        {/* Find Hospitals Drawer */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              onClick={fetchNearbyHospitals}
              variant="outline"
              className="w-full h-16 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              disabled={isLoadingLocation}
            >
              <Ambulance className="h-6 w-6 mr-3" />
              {isLoadingLocation
                ? "Finding Hospitals..."
                : "Find Nearby Hospitals"}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh]">
            <DrawerHeader className="text-center">
              <DrawerTitle className="flex items-center justify-center">
                <MapPin className="h-5 w-5 mr-2" />
                Nearby Hospitals
              </DrawerTitle>
              <DrawerDescription>
                {userLocation
                  ? `Based on your location: ${userLocation}`
                  : "Hospitals in your area"}
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-4 pb-6 space-y-3 overflow-y-auto max-h-96">
              {hospitals.map((hospital) => (
                <Card
                  key={hospital.id}
                  className="border-l-4 border-l-blue-500"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {hospital.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {hospital.address}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge
                          variant={
                            hospital.type === "government"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {hospital.type}
                        </Badge>
                        {hospital.emergencyServices && (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
                            24/7 Emergency
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {hospital.distance} km away
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />~
                        {hospital.estimatedTime} min
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        {hospital.rating}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleCallHospital(hospital)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button
                        onClick={() => handleNavigateToHospital(hospital)}
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Navigate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DrawerContent>
        </Drawer>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-16 flex-col space-y-2 border-green-600 text-green-600 hover:bg-green-50"
            onClick={() => Router.push("/profile")}
          >
            <div className="w-8 h-8  flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">My Profile</span>
          </Button>

          <Button
            variant="outline"
            className="h-16 flex-col space-y-2 border-purple-600 text-purple-600 hover:bg-purple-50"
            onClick={() => Router.push("/profile/edit")}
          >
            <div className="w-12 h-12  flex items-center justify-center">
              <CogIcon className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">Edit Profile</span>
          </Button>
        </div>

        {/* Emergency Info Card */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <InfoIcon className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-amber-800">Emergency Tips</h3>
                <p className="text-sm text-amber-700 mt-1">
                  In case of emergency, stay calm and provide clear information
                  about your location and situation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
