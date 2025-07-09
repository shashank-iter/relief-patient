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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Save, ArrowLeft, PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { clientDelete, clientPost } from "@/utils/clientApi";
import { convertToDatePickerFormat } from "@/lib/utils";

const diseaseStatuses = ["current", "earlier"];

export default function MedicalHistoryForm({
  initialData,
  onRefresh,
  reloadProfile,
  setReloadProfile,
}) {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [modals, setModals] = useState({
    disease: false,
    allergy: false,
    injury: false,
    editDisease: false,
    editAllergy: false,
    editInjury: false,
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [newItems, setNewItems] = useState({
    disease: { name: "", status: "current", from: "", to: "", medication: "" },
    allergy: { reason: "", symptoms: "", medication: "" },
    injury: {
      body_part: "",
      surgery: false,
      stitches: false,
      recovered: false,
      injury_year: new Date().getFullYear(),
      surgery_year: new Date().getFullYear(),
    },
  });
  const [editItems, setEditItems] = useState({
    disease: { name: "", status: "current", from: "", to: "", medication: "" },
    allergy: { reason: "", symptoms: "", medication: "" },
    injury: {
      body_part: "",
      surgery: false,
      stitches: false,
      recovered: false,
      injury_year: new Date().getFullYear(),
      surgery_year: new Date().getFullYear(),
    },
  });
  const router = useRouter();

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleModalOpen = (type) => {
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const handleModalClose = (type) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setEditingIndex(null);

    // Reset the form for the specific type
    if (type === "disease" || type === "editDisease") {
      setNewItems((prev) => ({
        ...prev,
        disease: {
          name: "",
          status: "current",
          from: "",
          to: "",
          medication: "",
        },
      }));
      setEditItems((prev) => ({
        ...prev,
        disease: {
          name: "",
          status: "current",
          from: "",
          to: "",
          medication: "",
        },
      }));
    } else if (type === "allergy" || type === "editAllergy") {
      setNewItems((prev) => ({
        ...prev,
        allergy: { reason: "", symptoms: "", medication: "" },
      }));
      setEditItems((prev) => ({
        ...prev,
        allergy: { reason: "", symptoms: "", medication: "" },
      }));
    } else if (type === "injury" || type === "editInjury") {
      setNewItems((prev) => ({
        ...prev,
        injury: {
          body_part: "",
          surgery: false,
          stitches: false,
          recovered: false,
          injury_year: new Date().getFullYear(),
          surgery_year: new Date().getFullYear(),
        },
      }));
      setEditItems((prev) => ({
        ...prev,
        injury: {
          body_part: "",
          surgery: false,
          stitches: false,
          recovered: false,
          injury_year: new Date().getFullYear(),
          surgery_year: new Date().getFullYear(),
        },
      }));
    }
  };

  const handleNewItemChange = (type, field, value) => {
    setNewItems((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const handleEditItemChange = (type, field, value) => {
    setEditItems((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const openEditModal = (type, index, item) => {
    setEditingIndex(index);
    setEditItems((prev) => ({
      ...prev,
      [type]: { ...item },
    }));
    handleModalOpen(`edit${type.charAt(0).toUpperCase() + type.slice(1)}`);
  };

  const addDisease = async () => {
    try {
      const response = await clientPost(
        "/users/patient/medical-history/disease",
        {
          name: newItems?.disease?.name,
          status: newItems?.disease?.status,
          from: newItems?.disease?.from,
          to: newItems?.disease?.to,
          medication: newItems?.disease?.medication,
        }
      );

      console.log(response);
      setReloadProfile(!reloadProfile);
      toast.success("Disease Added", {
        description: response?.message,
        className: "bg-green-600 text-white",
      });
      handleModalClose("disease");
    } catch (e) {
      toast.error("Something went wrong", {
        description: e?.response?.data?.message,
      });
    }
  };

  const updateDisease = async () => {
    try {
      const response = await clientPost(
        "/users/patient/medical-history/disease",
        {
          ...editItems?.disease,
          itemId: editItems?.disease?._id,
        }
      );
      console.log(response);
      toast.success("Disease updated", {
        description: response?.message,
        className: "bg-green-600 text-white",
      });
      setReloadProfile(!reloadProfile);
      handleModalClose("editDisease");
    } catch (err) {
      toast.error("Something went wrong", {
        description: err?.response?.data?.message,
      });
    }
  };

  const removeDisease = async (diseaseId) => {
    try {
      const response = await clientDelete(
        `/users/patient/medical-history/disease/${diseaseId}`
      );
      console.log(response);
      toast.success("Disease Deleted", {
        description: response?.message,
        className: "bg-green-600 text-white",
      });
      //update profile after deleting allergies.
      setReloadProfile(!reloadProfile);
    } catch (err) {
     toast.error("Something went wrong", {
        description: err?.response?.data?.message,
      });
    }
  };

  const addAllergy = async () => {
    try {
      const response = await clientPost(
        "/users/patient/medical-history/allergy",
        {
          reason: newItems?.allergy?.reason,
          symptoms: newItems?.allergy?.symptoms,
          medication: newItems?.allergy?.medication,
        }
      );

      console.log(response);
      setReloadProfile(!reloadProfile);
      toast.success("Allergy Added", {
        description: response?.message,
        className: "bg-green-600 text-white",
      });
      handleModalClose("allergy");
    } catch (e) {
      toast.error("Something went wrong", {
        description: e?.response?.data?.message,
      });
    }
  };

  const updateAllergy = async () => {
    try {
      const response = await clientPost(
        "/users/patient/medical-history/allergy",
        {
          ...editItems?.allergy,
          itemId: editItems?.allergy?._id,
        }
      );
      console.log(response);
      toast.success("Allergy updated", {
        description: response?.message,
        className: "bg-green-600 text-white",
      });
      setReloadProfile(!reloadProfile);
      handleModalClose("editAllergy");
    } catch (err) {
      toast.error("Something went wrong", {
        description: err?.response?.data?.message,
      });
    }
  };

  const removeAllergy = async (allergyId) => {
    try {
      const response = await clientDelete(
        `/users/patient/medical-history/allergy/${allergyId}`
      );
      console.log(response);
      toast.success("Allergy Deleted", {
        description: response?.message,
        className: "bg-green-600 text-white",
      });
      //update profile after deleting allergies.
      setReloadProfile(!reloadProfile);
    } catch (err) {
     toast.error("Something went wrong", {
        description: err?.response?.data?.message,
      });
    }
  };

  const addInjury = async () => {
    try {
      const response = await clientPost(
        "/users/patient/medical-history/injury",
        {
          body_part: newItems?.injury?.body_part,
          injury_year: newItems?.injury?.injury_year,
          surgery_year: newItems?.injury?.surgery_year,
          surgery: newItems?.injury?.surgery,
          stitches: newItems?.injury?.stitches,
          recovered: newItems?.injury?.recovered,
        }
      );

      console.log(response);
      setReloadProfile(!reloadProfile);
      toast.success("Injury Added", {
        description: response?.message,
        className: "bg-green-600 text-white",
      });
      handleModalClose("injury");
    } catch (e) {
      toast.error("Something went wrong", {
        description: e?.response?.data?.message,
      });
    }
  };

  const updateInjury = async () => {
    try {
      const response = await clientPost(
        "/users/patient/medical-history/injury",
        {
          ...editItems?.injury,
          itemId: editItems?.injury?._id,
        }
      );
      console.log(response);
      toast.success("Injury updated", {
        description: response?.message,
        className: "bg-green-600 text-white",
      });
      setReloadProfile(!reloadProfile);
      handleModalClose("editInjury");
    } catch (err) {
      toast.error("Something went wrong", {
        description: err?.response?.data?.message,
      });
    }
  };

  const removeInjury = async (injuryId) => {
    try {
      const response = await clientDelete(
        `/users/patient/medical-history/injury/${injuryId}`
      );
      console.log(response);
      toast.success(response?.message);
      //update profile after deleting injuries.
      setReloadProfile(!reloadProfile);
    } catch (err) {
    toast.error("Something went wrong", {
        description: err?.response?.data?.message,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsLoading(true);

    try {
      // Here you would typically send the data to your API
      console.log(formData);
      toast({
        title: "Medical History Updated",
        description: "Medical history has been successfully updated.",
        className: "bg-green-600 text-white",
      });

      router.push("/"); // Redirect to profile view
    } catch (error) {
     toast.error("Something went wrong", {
        description: error.message,
      });
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-2 mb-16">
      {/* Header Actions */}
      {/* <div className="flex justify-between items-center">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
        <Button type="submit" disabled={isLoading} className="flex items-center">
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div> */}

      {/* Medical History */}
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
          <CardDescription>Diseases, allergies, and injuries</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="diseases">
            <TabsList className="grid grid-cols-3 mb-4 mx-auto">
              <TabsTrigger value="diseases">Diseases</TabsTrigger>
              <TabsTrigger value="allergies">Allergies</TabsTrigger>
              <TabsTrigger value="injuries">Injuries</TabsTrigger>
            </TabsList>

            {/* Diseases Tab */}
            <TabsContent value="diseases" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Medical Conditions</h3>

                <Dialog
                  open={modals.disease}
                  onOpenChange={() =>
                    modals.disease
                      ? handleModalClose("disease")
                      : handleModalOpen("disease")
                  }
                >
                  <DialogTrigger asChild>
                    <Button type="button" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Disease
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add Medical Condition</DialogTitle>
                      <DialogDescription>
                        Add a new medical condition or disease to the patient's
                        history.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Disease Name *</Label>
                          <Input
                            value={newItems?.disease?.name}
                            onChange={(e) =>
                              handleNewItemChange(
                                "disease",
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="Enter disease name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Status *</Label>
                          <Select
                            value={newItems?.disease?.status}
                            onValueChange={(value) =>
                              handleNewItemChange("disease", "status", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {diseaseStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>From Date</Label>
                          <Input
                            type="date"
                            value={newItems?.disease?.from}
                            onChange={(e) =>
                              handleNewItemChange(
                                "disease",
                                "from",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        {newItems?.disease?.status !== "current" && (
                          <div className="space-y-2">
                            <Label>To Date</Label>
                            <Input
                              type="date"
                              value={newItems?.disease?.to}
                              onChange={(e) =>
                                handleNewItemChange(
                                  "disease",
                                  "to",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Current Medication</Label>
                        <Textarea
                          value={newItems?.disease?.medication}
                          onChange={(e) =>
                            handleNewItemChange(
                              "disease",
                              "medication",
                              e.target.value
                            )
                          }
                          placeholder="List current medications and dosages"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleModalClose("disease")}
                      >
                        Cancel
                      </Button>
                      <Button type="button" onClick={addDisease}>
                        Add Disease
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Edit Disease Modal */}
                <Dialog
                  open={modals.editDisease}
                  onOpenChange={() =>
                    modals.editDisease
                      ? handleModalClose("editDisease")
                      : handleModalOpen("editDisease")
                  }
                >
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Edit Medical Condition</DialogTitle>
                      <DialogDescription>
                        Edit the medical condition or disease details.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Disease Name *</Label>
                          <Input
                            value={editItems?.disease?.name}
                            onChange={(e) =>
                              handleEditItemChange(
                                "disease",
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="Enter disease name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Status *</Label>
                          <Select
                            value={editItems?.disease?.status}
                            onValueChange={(value) =>
                              handleEditItemChange("disease", "status", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {diseaseStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>From Date</Label>
                          <Input
                            type="date"
                            value={convertToDatePickerFormat(
                              editItems?.disease?.from
                            )}
                            onChange={(e) =>
                              handleEditItemChange(
                                "disease",
                                "from",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>To Date</Label>
                          <Input
                            type="date"
                            value={convertToDatePickerFormat(
                              editItems?.disease?.to
                            )}
                            onChange={(e) =>
                              handleEditItemChange(
                                "disease",
                                "to",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Current Medication</Label>
                        <Textarea
                          value={editItems?.disease?.medication}
                          onChange={(e) =>
                            handleEditItemChange(
                              "disease",
                              "medication",
                              e.target.value
                            )
                          }
                          placeholder="List current medications and dosages"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleModalClose("editDisease")}
                      >
                        Cancel
                      </Button>
                      <Button type="button" onClick={updateDisease}>
                        Update Disease
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {formData?.medicalHistory?.diseases?.map((disease, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Disease {index + 1}</h4>
                    <div className="flex gap-x-2 items-center justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        className={"hover:bg-blue-300"}
                        size="sm"
                        onClick={() => openEditModal("disease", index, disease)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className={"hover:bg-red-300"}
                        size="sm"
                        onClick={() => removeDisease(disease?._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Disease Name *</Label>
                      <Input
                        value={disease?.name}
                        onChange={(e) => {
                          const newDiseases = [
                            ...formData?.medicalHistory?.diseases,
                          ];
                          newDiseases[index] = {
                            ...newDiseases[index],
                            name: e.target.value,
                          };
                          setFormData((prev) => ({
                            ...prev,
                            medicalHistory: {
                              ...prev.medicalHistory,
                              diseases: newDiseases,
                            },
                          }));
                        }}
                        required
                        disabled={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status *</Label>
                      <Select
                        value={disease?.status}
                        onValueChange={(value) => {
                          const newDiseases = [
                            ...formData?.medicalHistory?.diseases,
                          ];
                          newDiseases[index] = {
                            ...newDiseases[index],
                            status: value,
                          };
                          setFormData((prev) => ({
                            ...prev,
                            medicalHistory: {
                              ...prev.medicalHistory,
                              diseases: newDiseases,
                            },
                          }));
                        }}
                        disabled={true}
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
                    {disease?.from !== null && (
                      <div className="space-y-2">
                        <Label>From Date</Label>
                        <Input
                          type="date"
                          value={convertToDatePickerFormat(disease?.from)}
                          onChange={(e) => {
                            const newDiseases = [
                              ...formData?.medicalHistory?.diseases,
                            ];
                            newDiseases[index] = {
                              ...newDiseases[index],
                              from: e.target.value,
                            };
                            setFormData((prev) => ({
                              ...prev,
                              medicalHistory: {
                                ...prev.medicalHistory,
                                diseases: newDiseases,
                              },
                            }));
                          }}
                          disabled={true}
                        />
                      </div>
                    )}
                    {disease?.to !== null && (
                      <div className="space-y-2">
                        <Label>To Date</Label>
                        <Input
                          type="date"
                          value={convertToDatePickerFormat(disease?.to)}
                          onChange={(e) => {
                            const newDiseases = [
                              ...formData?.medicalHistory?.diseases,
                            ];
                            newDiseases[index] = {
                              ...newDiseases[index],
                              to: e.target.value,
                            };
                            setFormData((prev) => ({
                              ...prev,
                              medicalHistory: {
                                ...prev.medicalHistory,
                                diseases: newDiseases,
                              },
                            }));
                          }}
                          disabled={true}
                        />
                      </div>
                    )}
                    <div className="space-y-2 md:col-span-2">
                      <Label>Current Medication</Label>
                      <Textarea
                        value={disease?.medication}
                        onChange={(e) => {
                          const newDiseases = [
                            ...formData?.medicalHistory?.diseases,
                          ];
                          newDiseases[index] = {
                            ...newDiseases[index],
                            medication: e.target.value,
                          };
                          setFormData((prev) => ({
                            ...prev,
                            medicalHistory: {
                              ...prev.medicalHistory,
                              diseases: newDiseases,
                            },
                          }));
                        }}
                        placeholder="List current medications and dosages"
                        disabled={true}
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

                <Dialog
                  open={modals.allergy}
                  onOpenChange={() =>
                    modals.allergy
                      ? handleModalClose("allergy")
                      : handleModalOpen("allergy")
                  }
                >
                  <DialogTrigger asChild>
                    <Button type="button" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Allergy
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Allergy</DialogTitle>
                      <DialogDescription>
                        Add a new allergy to the patient's medical history.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Allergy Cause *</Label>
                        <Input
                          value={newItems?.allergy?.reason}
                          onChange={(e) =>
                            handleNewItemChange(
                              "allergy",
                              "reason",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Peanuts, Shellfish, Pollen"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Symptoms *</Label>
                        <Textarea
                          value={newItems?.allergy?.symptoms}
                          onChange={(e) =>
                            handleNewItemChange(
                              "allergy",
                              "symptoms",
                              e.target.value
                            )
                          }
                          placeholder="Describe the symptoms experienced"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Treatment/Medication</Label>
                        <Input
                          value={newItems?.allergy?.medication}
                          onChange={(e) =>
                            handleNewItemChange(
                              "allergy",
                              "medication",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Epinephrine, Antihistamines"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleModalClose("allergy")}
                      >
                        Cancel
                      </Button>
                      <Button type="button" onClick={addAllergy}>
                        Add Allergy
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Edit Allergy Modal */}
                <Dialog
                  open={modals.editAllergy}
                  onOpenChange={() =>
                    modals.editAllergy
                      ? handleModalClose("editAllergy")
                      : handleModalOpen("editAllergy")
                  }
                >
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Allergy</DialogTitle>
                      <DialogDescription>
                        Edit the allergy details.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Allergy Cause *</Label>
                        <Input
                          value={editItems?.allergy?.reason}
                          onChange={(e) =>
                            handleEditItemChange(
                              "allergy",
                              "reason",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Peanuts, Shellfish, Pollen"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Symptoms *</Label>
                        <Textarea
                          value={editItems?.allergy?.symptoms}
                          onChange={(e) =>
                            handleEditItemChange(
                              "allergy",
                              "symptoms",
                              e.target.value
                            )
                          }
                          placeholder="Describe the symptoms experienced"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Treatment/Medication</Label>
                        <Input
                          value={editItems?.allergy?.medication}
                          onChange={(e) =>
                            handleEditItemChange(
                              "allergy",
                              "medication",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Epinephrine, Antihistamines"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleModalClose("editAllergy")}
                      >
                        Cancel
                      </Button>
                      <Button type="button" onClick={updateAllergy}>
                        Update Allergy
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {formData?.medicalHistory?.allergies.map((allergy, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Allergy {index + 1}</h4>
                    <div className="flex gap-x-2 items-center justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={"hover:bg-blue-300"}
                        onClick={() => openEditModal("allergy", index, allergy)}
                      >
                        <PencilIcon className="h-4 w-4 " />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={"hover:bg-red-300"}
                        onClick={() => removeAllergy(allergy?._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Allergy Cause *</Label>
                      <Input
                        value={allergy?.reason}
                        onChange={(e) => {
                          const newAllergies = [
                            ...formData?.medicalHistory?.allergies,
                          ];
                          newAllergies[index] = {
                            ...newAllergies[index],
                            reason: e.target.value,
                          };
                          setFormData((prev) => ({
                            ...prev,
                            medicalHistory: {
                              ...prev.medicalHistory,
                              allergies: newAllergies,
                            },
                          }));
                        }}
                        placeholder="e.g., Peanuts, Shellfish, Pollen"
                        required
                        disabled={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Treatment/Medication</Label>
                      <Input
                        value={allergy?.medication}
                        onChange={(e) => {
                          const newAllergies = [
                            ...formData?.medicalHistory?.allergies,
                          ];
                          newAllergies[index] = {
                            ...newAllergies[index],
                            medication: e.target.value,
                          };
                          setFormData((prev) => ({
                            ...prev,
                            medicalHistory: {
                              ...prev.medicalHistory,
                              allergies: newAllergies,
                            },
                          }));
                        }}
                        placeholder="e.g., Epinephrine, Antihistamines"
                        disabled={true}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Symptoms *</Label>
                      <Textarea
                        value={allergy?.symptoms}
                        onChange={(e) => {
                          const newAllergies = [
                            ...formData?.medicalHistory?.allergies,
                          ];
                          newAllergies[index] = {
                            ...newAllergies[index],
                            symptoms: e.target.value,
                          };
                          setFormData((prev) => ({
                            ...prev,
                            medicalHistory: {
                              ...prev.medicalHistory,
                              allergies: newAllergies,
                            },
                          }));
                        }}
                        placeholder="Describe the symptoms experienced"
                        required
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Injuries Tab */}
            <TabsContent value="injuries" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Injuries</h3>

                <Dialog
                  open={modals.injury}
                  onOpenChange={() =>
                    modals.injury
                      ? handleModalClose("injury")
                      : handleModalOpen("injury")
                  }
                >
                  <DialogTrigger asChild>
                    <Button type="button" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Injury
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add Injury</DialogTitle>
                      <DialogDescription>
                        Add a new injury to the patient's medical history.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Body Part *</Label>
                          <Input
                            value={newItems?.injury?.body_part}
                            onChange={(e) =>
                              handleNewItemChange(
                                "injury",
                                "body_part",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Left knee, Right shoulder"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Injury Year *</Label>
                          <Input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear()}
                            value={newItems?.injury?.injury_year}
                            onChange={(e) =>
                              handleNewItemChange(
                                "injury",
                                "injury_year",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="surgery"
                            checked={newItems?.injury?.surgery}
                            onCheckedChange={(checked) =>
                              handleNewItemChange("injury", "surgery", checked)
                            }
                          />
                          <Label htmlFor="surgery">Required Surgery</Label>
                        </div>

                        {newItems?.injury?.surgery && (
                          <div className="space-y-2">
                            <Label>Surgery Year</Label>
                            <Input
                              type="number"
                              min="1900"
                              max={new Date().getFullYear()}
                              value={newItems?.injury?.surgery_year}
                              onChange={(e) =>
                                handleNewItemChange(
                                  "injury",
                                  "surgery_year",
                                  parseInt(e.target.value)
                                )
                              }
                            />
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="stitches"
                            checked={newItems?.injury?.stitches}
                            onCheckedChange={(checked) =>
                              handleNewItemChange("injury", "stitches", checked)
                            }
                          />
                          <Label htmlFor="stitches">Required Stitches</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="recovered"
                            checked={newItems?.injury?.recovered}
                            onCheckedChange={(checked) =>
                              handleNewItemChange(
                                "injury",
                                "recovered",
                                checked
                              )
                            }
                          />
                          <Label htmlFor="recovered">Fully Recovered</Label>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleModalClose("injury")}
                      >
                        Cancel
                      </Button>
                      <Button type="button" onClick={addInjury}>
                        Add Injury
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Edit Injury Modal */}
                <Dialog
                  open={modals.editInjury}
                  onOpenChange={() =>
                    modals.editInjury
                      ? handleModalClose("editInjury")
                      : handleModalOpen("editInjury")
                  }
                >
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Edit Injury</DialogTitle>
                      <DialogDescription>
                        Edit the injury details.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Body Part *</Label>
                          <Input
                            value={editItems?.injury?.body_part}
                            onChange={(e) =>
                              handleEditItemChange(
                                "injury",
                                "body_part",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Left knee, Right shoulder"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Injury Year *</Label>
                          <Input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear()}
                            value={editItems?.injury?.injury_year}
                            onChange={(e) =>
                              handleEditItemChange(
                                "injury",
                                "injury_year",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="edit-surgery"
                            checked={editItems?.injury?.surgery}
                            onCheckedChange={(checked) =>
                              handleEditItemChange("injury", "surgery", checked)
                            }
                          />
                          <Label htmlFor="edit-surgery">Required Surgery</Label>
                        </div>

                        {editItems?.injury?.surgery && (
                          <div className="space-y-2">
                            <Label>Surgery Year</Label>
                            <Input
                              type="number"
                              min="1900"
                              max={new Date().getFullYear()}
                              value={editItems?.injury?.surgery_year}
                              onChange={(e) =>
                                handleEditItemChange(
                                  "injury",
                                  "surgery_year",
                                  parseInt(e.target.value)
                                )
                              }
                            />
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="edit-stitches"
                            checked={editItems?.injury?.stitches}
                            onCheckedChange={(checked) =>
                              handleEditItemChange(
                                "injury",
                                "stitches",
                                checked
                              )
                            }
                          />
                          <Label htmlFor="edit-stitches">
                            Required Stitches
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="edit-recovered"
                            checked={editItems?.injury?.recovered}
                            onCheckedChange={(checked) =>
                              handleEditItemChange(
                                "injury",
                                "recovered",
                                checked
                              )
                            }
                          />
                          <Label htmlFor="edit-recovered">
                            Fully Recovered
                          </Label>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleModalClose("editInjury")}
                      >
                        Cancel
                      </Button>
                      <Button type="button" onClick={updateInjury}>
                        Update Injury
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {formData?.medicalHistory?.injuries.map((injury, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Injury {index + 1}</h4>
                    <div className="flex gap-x-2 items-center justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        className={"hover:bg-blue-300"}
                        size="sm"
                        onClick={() => openEditModal("injury", index, injury)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={"hover:bg-red-300"}
                        onClick={() => removeInjury(injury?._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Body Part *</Label>
                      <Input
                        value={injury?.body_part}
                        onChange={(e) => {
                          const newInjuries = [
                            ...formData?.medicalHistory?.injuries,
                          ];
                          newInjuries[index] = {
                            ...newInjuries[index],
                            body_part: e.target.value,
                          };
                          setFormData((prev) => ({
                            ...prev,
                            medicalHistory: {
                              ...prev.medicalHistory,
                              injuries: newInjuries,
                            },
                          }));
                        }}
                        placeholder="e.g., Left knee, Right shoulder"
                        required
                        disabled={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Injury Year *</Label>
                      <Input
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={injury?.injury_year}
                        onChange={(e) => {
                          const newInjuries = [
                            ...formData?.medicalHistory?.injuries,
                          ];
                          newInjuries[index] = {
                            ...newInjuries[index],
                            injury_year: parseInt(e.target.value),
                          };
                          setFormData((prev) => ({
                            ...prev,
                            medicalHistory: {
                              ...prev.medicalHistory,
                              injuries: newInjuries,
                            },
                          }));
                        }}
                        required
                        disabled={true}
                      />
                    </div>
                    <div className="space-y-4 md:col-span-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`surgery-${index}`}
                          checked={injury?.surgery}
                          onCheckedChange={(checked) => {
                            const newInjuries = [
                              ...formData?.medicalHistory?.injuries,
                            ];
                            newInjuries[index] = {
                              ...newInjuries[index],
                              surgery: checked,
                            };
                            setFormData((prev) => ({
                              ...prev,
                              medicalHistory: {
                                ...prev.medicalHistory,
                                injuries: newInjuries,
                              },
                            }));
                          }}
                          disabled={true}
                        />
                        <Label htmlFor={`surgery-${index}`}>
                          Required Surgery
                        </Label>
                      </div>

                      {injury?.surgery && (
                        <div className="space-y-2">
                          <Label>Surgery Year</Label>
                          <Input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear()}
                            value={injury?.surgery_year}
                            onChange={(e) => {
                              const newInjuries = [
                                ...formData?.medicalHistory?.injuries,
                              ];
                              newInjuries[index] = {
                                ...newInjuries[index],
                                surgery_year: parseInt(e.target.value),
                              };
                              setFormData((prev) => ({
                                ...prev,
                                medicalHistory: {
                                  ...prev.medicalHistory,
                                  injuries: newInjuries,
                                },
                              }));
                            }}
                            disabled={true}
                          />
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`stitches-${index}`}
                          checked={injury?.stitches}
                          onCheckedChange={(checked) => {
                            const newInjuries = [
                              ...formData?.medicalHistory?.injuries,
                            ];
                            newInjuries[index] = {
                              ...newInjuries[index],
                              stitches: checked,
                            };
                            setFormData((prev) => ({
                              ...prev,
                              medicalHistory: {
                                ...prev.medicalHistory,
                                injuries: newInjuries,
                              },
                            }));
                          }}
                          disabled={true}
                        />
                        <Label htmlFor={`stitches-${index}`}>
                          Required Stitches
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`recovered-${index}`}
                          checked={injury?.recovered}
                          onCheckedChange={(checked) => {
                            const newInjuries = [
                              ...formData?.medicalHistory?.injuries,
                            ];
                            newInjuries[index] = {
                              ...newInjuries[index],
                              recovered: checked,
                            };
                            setFormData((prev) => ({
                              ...prev,
                              medicalHistory: {
                                ...prev.medicalHistory,
                                injuries: newInjuries,
                              },
                            }));
                          }}
                          disabled={true}
                        />
                        <Label htmlFor={`recovered-${index}`}>
                          Fully Recovered
                        </Label>
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
      {/* <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Medical History"}
        </Button>
      </div> */}
    </form>
  );
}
