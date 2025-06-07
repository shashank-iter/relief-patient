"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { clientPost, clientPut } from "@/utils/clientApi";
import { convertToDatePickerFormat } from "@/lib/utils";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function PersonalInformationForm({
  initialData,
  onRefresh,
  reloadProfile,
  setReloadProfile,
}) {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (field, value, section) => {
    setFormData((prev) => {
      const newData = { ...prev };

      if (section) {
        // Handle nested object updates
        newData[section] = {
          ...newData[section],
          [field]: value,
        };
      } else {
        // Handle top-level updates
        newData[field] = value;
      }

      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would typically send the data to your API
      console.log(formData);
      const response = await clientPut("/users/patient/update-profile/", {
        name: formData?.name || "",
        phoneNumber: formData?.phoneNumber || "",
        dob: formData?.dob || "",
        bloodGroup: formData?.bloodGroup || "",
        aadharNumber: formData?.aadharNumber || "",
        address: formData?.address || "",
        coordinates: formData?.location.coordinates || [0, 0],
      });

      console.log(response);

      // update profile data
      setReloadProfile(!reloadProfile);

      toast.success("Personal Information Updated", {
        description: "Personal information has been successfully updated.",
      });

      // router.push("/"); // Redirect to profile view
    } catch (error) {
      toast("Something went wrong", {
        description: "Failed to update personal information. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-2 mb-16">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
        {/* <Button type="submit" disabled={isLoading} className="flex items-center">
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button> */}
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Basic patient details and identification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData?.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData?.age}
                onChange={(e) =>
                  handleInputChange("age", Number.parseInt(e.target.value))
                }
                required
              />
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                value={convertToDatePickerFormat(formData?.dob)}
                onChange={(e) => {
                  console.log("date", e.target.value);
                  handleInputChange("dob", e.target.value);
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group *</Label>
              <Select
                value={formData?.bloodGroup}
                onValueChange={(value) =>
                  handleInputChange("bloodGroup", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="aadhar">Aadhar Number *</Label>
              <Input
                id="aadhar"
                value={formData?.aadharNumber}
                onChange={(e) =>
                  handleInputChange("aadharNumber", e.target.value)
                }
                placeholder="12-digit Aadhar number"
                maxLength={12}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData?.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="10-digit phone number"
                maxLength={10}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
          <CardDescription>Current residential address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="locality">Locality/Area *</Label>
              <Input
                id="locality"
                value={formData?.address.locality}
                onChange={(e) =>
                  handleInputChange("locality", e.target.value, "address")
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData?.address.city}
                onChange={(e) =>
                  handleInputChange("city", e.target.value, "address")
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData?.address.state}
                onChange={(e) =>
                  handleInputChange("state", e.target.value, "address")
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                value={formData?.address.pincode}
                onChange={(e) =>
                  handleInputChange("pincode", e.target.value, "address")
                }
                maxLength={6}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Personal Information"}
        </Button>
      </div>
    </form>
  );
}
