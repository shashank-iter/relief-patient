"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { clientPut, clientPost } from "@/utils/clientApi"

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const relationships = ["Father", "Mother", "Spouse", "Sibling", "Child", "Friend", "Other"]
const diseaseStatuses = ["current", "past", "chronic", "resolved"]

export default function ProfileEditForm({ initialData }) {
  const [formData, setFormData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field, value, section, index) => {
    setFormData((prev) => {
      const newData = { ...prev }

      if (section && typeof index === "number") {
        // Handle nested array updates
        newData[section][index] = {
          ...newData[section][index],
          [field]: value,
        }
      } else if (section) {
        // Handle nested object updates
        newData[section] = {
          ...newData[section],
          [field]: value,
        }
      } else {
        // Handle top-level updates
        newData[field] = value
      }

      return newData
    })
  }

  const addEmergencyContact = () => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: "", phoneNumber: "", email: "", relationship: "" }],
    }))
  }

  const removeEmergencyContact = (index) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
    }))
  }

  const addDisease = () => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        diseases: [...prev.medicalHistory.diseases, { name: "", status: "current", from: "", to: "", medication: "" }],
      },
    }))
  }

  const removeDisease = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        diseases: prev.medicalHistory.diseases.filter((_, i) => i !== index),
      },
    }))
  }

  const addAllergy = () => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        allergies: [...prev.medicalHistory.allergies, { reason: "", symptoms: "", medication: "" }],
      },
    }))
  }

  const removeAllergy = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        allergies: prev.medicalHistory.allergies.filter((_, i) => i !== index),
      },
    }))
  }

  const addInjury = () => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        injuries: [
          ...prev.medicalHistory.injuries,
          {
            body_part: "",
            surgery: false,
            stitches: false,
            recovered: false,
            injury_year: new Date().getFullYear(),
            surgery_year: new Date().getFullYear(),
          },
        ],
      },
    }))
  }

  const removeInjury = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        injuries: prev.medicalHistory.injuries.filter((_, i) => i !== index),
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Here you would typically send the data to your API
    //   await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
console.log(formData)
      toast({
        title: "Profile Updated",
        description: "Patient profile has been successfully updated.",
      })

      router.push("/") // Redirect to profile view
    } catch (error) {
      toast.error("Something went wrong", {
        description: error.message,
      });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-2 mb-16">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
        <Button type="submit" disabled={isLoading} className="flex items-center">
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Basic patient details and identification</CardDescription>
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
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData?.age}
                onChange={(e) => handleInputChange("age", Number.parseInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                value={formData?.dob}
                onChange={(e) => handleInputChange("dob", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group *</Label>
              <Select value={formData?.bloodGroup} onValueChange={(value) => handleInputChange("bloodGroup", value)}>
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
                onChange={(e) => handleInputChange("aadharNumber", e.target.value)}
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
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
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
                onChange={(e) => handleInputChange("locality", e.target.value, "address")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData?.address.city}
                onChange={(e) => handleInputChange("city", e.target.value, "address")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData?.address.state}
                onChange={(e) => handleInputChange("state", e.target.value, "address")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                value={formData?.address.pincode}
                onChange={(e) => handleInputChange("pincode", e.target.value, "address")}
                maxLength={6}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Emergency Contacts</CardTitle>
              <CardDescription>People to contact in case of emergency</CardDescription>
            </div>
            <Button type="button" onClick={addEmergencyContact} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData?.emergencyContacts.map((contact, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Contact {index + 1}</h4>
                {formData?.emergencyContacts.length > 1 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => removeEmergencyContact(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={contact.name}
                    onChange={(e) => handleInputChange("name", e.target.value, "emergencyContacts", index)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    value={contact.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value, "emergencyContacts", index)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={contact.email}
                    onChange={(e) => handleInputChange("email", e.target.value, "emergencyContacts", index)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Relationship *</Label>
                  <Select
                    value={contact.relationship}
                    onValueChange={(value) => handleInputChange("relationship", value, "emergencyContacts", index)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationships.map((rel) => (
                        <SelectItem key={rel} value={rel}>
                          {rel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Medical History */}
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
          <CardDescription>Diseases, allergies, and past injuries</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="diseases">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="diseases">Diseases</TabsTrigger>
              <TabsTrigger value="allergies">Allergies</TabsTrigger>
              <TabsTrigger value="injuries">Injuries</TabsTrigger>
            </TabsList>

            {/* Diseases Tab */}
            <TabsContent value="diseases" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Medical Conditions</h3>
                <Button type="button" onClick={addDisease} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Disease
                </Button>
              </div>
              {formData?.medicalHistory.diseases.map((disease, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Disease {index + 1}</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => removeDisease(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Disease Name *</Label>
                      <Input
                        value={disease.name}
                        onChange={(e) => {
                          const newDiseases = [...formData?.medicalHistory.diseases]
                          newDiseases[index] = { ...newDiseases[index], name: e.target.value }
                          setFormData((prev) => ({
                            ...prev,
                            medicalHistory: { ...prev.medicalHistory, diseases: newDiseases },
                          }))
                        }}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status *</Label>
                      <Select
                        value={disease.status}
                        onValueChange={(value) => {
                          const newDiseases = [...formData?.medicalHistory.diseases]
                          newDiseases[index] = { ...newDiseases[index], status: value }
                          setFormData((prev) => ({
                            ...prev,
                            medicalHistory: { ...prev.medicalHistory, diseases: newDiseases },
                          }))
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {diseaseStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>From Date</Label>
                      <Input
                        type="date"
                        value={disease.from}
                        onChange={(e) => {
                          const newDiseases = [...formData?.medicalHistory.diseases]
                          newDiseases[index] = { ...newDiseases[index], from: e.target.value }
                          setFormData((prev) => ({
                            ...prev,
                            medicalHistory: { ...prev.medicalHistory, diseases: newDiseases },
                          }))
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>To Date</Label>
                      <Input
                        type="date"
                        value={disease.to}
                        onChange={(e) => {
                          const newDiseases = [...formData?.medicalHistory.diseases]
                          newDiseases[index] = { ...newDiseases[index], to: e.target.value }
                          setFormData((prev) => ({
                            ...prev,
                            medicalHistory: { ...prev.medicalHistory, diseases: newDiseases },
                          }))
                        }}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Current Medication</Label>
                      <Textarea
                        value={disease.medication}
                        onChange={(e) => {
                          const newDiseases = [...formData?.medicalHistory.diseases]
                          newDiseases[index] = { ...newDiseases[index], medication: e.target.value }
                          setFormData((prev) => ({
                            ...prev,
                            medicalHistory: { ...prev.medicalHistory, diseases: newDiseases },
                          }))
                        }}
                        placeholder="List current medications and dosages"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Allergies Tab */}
            <TabsContent value="allergies" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Allergies</h3>
                <Button type="button" onClick={addAllergy} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Allergy
                </Button>
              </div>
              {formData?.medicalHistory.allergies.map((allergy, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Allergy {index + 1}</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => removeAllergy(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Allergy Cause *</Label>
                      <Input
                        value={allergy.reason}
                        onChange={(e) => {
                          const newAllergies = [...formData?.medicalHistory.allergies]
                          newAllergies[index] = { ...newAllergies[index], reason: e.target.value }
                          setFormData((prev) => ({
                            ...prev,
                            medicalHistory: { ...prev.medicalHistory, allergies: newAllergies },
                          }))
                        }}
                        placeholder="e.g., Peanuts, Shellfish, Pollen"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Symptoms *</Label>
                      <Textarea
                        value={allergy.symptoms}
                        onChange={(e) => {
                          const newAllergies = [...formData?.medicalHistory.allergies]
                          newAllergies[index] = { ...newAllergies[index], symptoms: e.target.value }
                          setFormData((prev) => ({
                            ...prev,
                            medicalHistory: { ...prev.medicalHistory, allergies: newAllergies },
                          }))
                        }}
                        placeholder="Describe the symptoms experienced"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Treatment/Medication</Label>
                      <Input
                        value={allergy.medication}
                        onChange={(e) => {
                          const newAllergies = [...formData?.medicalHistory.allergies]
                          newAllergies[index] = { ...newAllergies[index], medication: e.target.value }
                          setFormData((prev) => ({
                            ...prev,
                            medicalHistory: { ...prev.medicalHistory, allergies: newAllergies },
                          }))
                        }}
                        placeholder="e.g., Epinephrine, Antihistamines"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Injuries Tab */}
            <TabsContent value="injuries" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Past Injuries</h3>
                <Button type="button" onClick={addInjury} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Injury
                </Button>
              </div>
              {formData?.medicalHistory.injuries.map((injury, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Injury {index + 1}</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => removeInjury(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Body Part *</Label>
                      <Input
                        value={injury.body_part}
                        onChange={(e) => {
                          const newInjuries = [...formData?.medicalHistory.injuries]
                          newInjuries[index] = { ...newInjuries[index], body_part: e.target.value }
                          setFormData((prev) => ({
                            ...prev,
                            medicalHistory: { ...prev.medicalHistory, injuries: newInjuries },
                          }))
                        }}
                        placeholder="e.g., Left Arm, Right Leg"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Injury Year *</Label>
                      <Input
                        type="number"
                        value={injury.injury_year}
                        onChange={(e) => {
                          const newInjuries = [...formData?.medicalHistory.injuries]
                          newInjuries[index] = { ...newInjuries[index], injury_year: Number.parseInt(e.target.value) }
                          setFormData((prev) => ({
                            ...prev,
                            medicalHistory: { ...prev.medicalHistory, injuries: newInjuries },
                          }))
                        }}
                        min="1900"
                        max={new Date().getFullYear()}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Surgery Year</Label>
                      <Input
                        type="number"
                        value={injury.surgery_year}
                        onChange={(e) => {
                          const newInjuries = [...formData?.medicalHistory.injuries]
                          newInjuries[index] = { ...newInjuries[index], surgery_year: Number.parseInt(e.target.value) }
                          setFormData((prev) => ({
                            ...prev,
                            medicalHistory: { ...prev.medicalHistory, injuries: newInjuries },
                          }))
                        }}
                        min="1900"
                        max={new Date().getFullYear()}
                        disabled={!injury.surgery}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`surgery-${index}`}
                          checked={injury.surgery}
                          onCheckedChange={(checked) => {
                            const newInjuries = [...formData?.medicalHistory.injuries]
                            newInjuries[index] = { ...newInjuries[index], surgery: checked }
                            setFormData((prev) => ({
                              ...prev,
                              medicalHistory: { ...prev.medicalHistory, injuries: newInjuries },
                            }))
                          }}
                        />
                        <Label htmlFor={`surgery-${index}`}>Required Surgery</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`stitches-${index}`}
                          checked={injury.stitches}
                          onCheckedChange={(checked) => {
                            const newInjuries = [...formData?.medicalHistory.injuries]
                            newInjuries[index] = { ...newInjuries[index], stitches: checked }
                            setFormData((prev) => ({
                              ...prev,
                              medicalHistory: { ...prev.medicalHistory, injuries: newInjuries },
                            }))
                          }}
                        />
                        <Label htmlFor={`stitches-${index}`}>Required Stitches</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`recovered-${index}`}
                          checked={injury.recovered}
                          onCheckedChange={(checked) => {
                            const newInjuries = [...formData?.medicalHistory.injuries]
                            newInjuries[index] = { ...newInjuries[index], recovered: checked }
                            setFormData((prev) => ({
                              ...prev,
                              medicalHistory: { ...prev.medicalHistory, injuries: newInjuries },
                            }))
                          }}
                        />
                        <Label htmlFor={`recovered-${index}`}>Fully Recovered</Label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  )
}