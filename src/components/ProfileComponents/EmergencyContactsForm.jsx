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
import { clientPost, clientDelete, clientPut } from "@/utils/clientApi";

const relationships = [
  "Father",
  "Mother",
  "Spouse",
  "Sibling",
  "Child",
  "Friend",
  "Other",
];

export default function EmergencyContactsForm({
  initialData,
  onRefresh,
  reloadProfile,
  setReloadProfile,
}) {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentContactIndex, setCurrentContactIndex] = useState(null);
  const [newContact, setNewContact] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    relationship: "",
  });
  const [updateContact, setUpdateContact] = useState({
    _id: "",
    name: "",
    phoneNumber: "",
    email: "",
    relationship: "",
  });
  const router = useRouter();

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (index, field, value) => {
    setFormData((prev) => {
      const newData = { ...prev };
      newData.emergencyContacts[index] = {
        ...newData.emergencyContacts[index],
        [field]: value,
      };
      return newData;
    });
  };

  const handleNewContactChange = (field, value) => {
    setNewContact((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateContactChange = (field, value) => {
    setUpdateContact((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openUpdateModal = (contact, index) => {
    setUpdateContact({
      _id: contact._id,
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      email: contact.email,
      relationship: contact.relationship,
    });
    setCurrentContactIndex(index);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setCurrentContactIndex(null);
    setUpdateContact({
      _id: "",
      name: "",
      phoneNumber: "",
      email: "",
      relationship: "",
    });
  };

  const addEmergencyContact = async () => {
    try {
      const response = await clientPost(
        "/users/patient/emergency-contacts",
        newContact
      );
      console.log(response);
      toast.success("Emergency contact added", {
        description: response?.message,
      });
      setReloadProfile(!reloadProfile);
      setIsModalOpen(false);
      setNewContact({
        name: "",
        phoneNumber: "",
        email: "",
        relationship: "",
      });
    } catch (err) {
      toast.error("Something went wrong", {
        description: err.message,
      });
    }
  };

  const updateEmergencyContact = async () => {
    try {
      const { _id, ...contactData } = updateContact;
      const response = await clientPut(
        `/users/patient/emergency-contacts/${_id}`,
        contactData
      );
      console.log(response);
      toast.success("Emergency contact updated", {
        description: response?.message,
      });
      setReloadProfile(!reloadProfile);
      closeUpdateModal();
    } catch (err) {
   toast.error("Something went wrong", {
        description: err.message,
      });
    }
  };

  const removeEmergencyContact = async (ec_id) => {
    try {
      const response = await clientDelete(
        `/users/patient/emergency-contacts/${ec_id}`
      );
      console.log(response);
      toast.success("Emergency contact deleted", {
        description: response?.message,
      });
      setReloadProfile(!reloadProfile);
    } catch (err) {
     toast.error("Something went wrong", {
        description: err.message,
      });
    }
  };

  return (
    <form className="space-y-6 px-2 pb-24 ">
      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Emergency Contacts</CardTitle>
              <CardDescription></CardDescription>
            </div>

            {/* Add Contact Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button type="button" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Emergency Contact</DialogTitle>
                  <DialogDescription>
                    Add a new emergency contact. All required fields must be
                    filled.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="modal-name">Name *</Label>
                    <Input
                      id="modal-name"
                      value={newContact.name}
                      onChange={(e) =>
                        handleNewContactChange("name", e.target.value)
                      }
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modal-phone">Phone Number *</Label>
                    <Input
                      id="modal-phone"
                      value={newContact.phoneNumber}
                      onChange={(e) =>
                        handleNewContactChange("phoneNumber", e.target.value)
                      }
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modal-email">Email</Label>
                    <Input
                      id="modal-email"
                      type="email"
                      value={newContact.email}
                      onChange={(e) =>
                        handleNewContactChange("email", e.target.value)
                      }
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship *</Label>
                    <Select
                      value={newContact.relationship}
                      onValueChange={(value) =>
                        handleNewContactChange("relationship", value)
                      }
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
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false);
                      setNewContact({
                        name: "",
                        phoneNumber: "",
                        email: "",
                        relationship: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={addEmergencyContact}>
                    Add Contact
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        {/* Update Contact Modal */}
        <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Emergency Contact</DialogTitle>
              <DialogDescription>
                Update the emergency contact details. All required fields must
                be filled.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="update-name">Name *</Label>
                <Input
                  id="update-name"
                  value={updateContact.name}
                  onChange={(e) =>
                    handleUpdateContactChange("name", e.target.value)
                  }
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="update-phone">Phone Number *</Label>
                <Input
                  id="update-phone"
                  value={updateContact.phoneNumber}
                  onChange={(e) =>
                    handleUpdateContactChange("phoneNumber", e.target.value)
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="update-email">Email</Label>
                <Input
                  id="update-email"
                  type="email"
                  value={updateContact.email}
                  onChange={(e) =>
                    handleUpdateContactChange("email", e.target.value)
                  }
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label>Relationship *</Label>
                <Select
                  value={updateContact.relationship}
                  onValueChange={(value) =>
                    handleUpdateContactChange("relationship", value)
                  }
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
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeUpdateModal}
              >
                Cancel
              </Button>
              <Button type="button" onClick={updateEmergencyContact}>
                Update Contact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <CardContent className="space-y-4">
          {formData?.emergencyContacts.map((contact, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Contact {index + 1}</h4>
                <div className="flex justify-end items-center gap-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={"hover:bg-blue-300"}
                    onClick={() => openUpdateModal(contact, index)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  {formData?.emergencyContacts.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={"hover:bg-red-300"}
                      onClick={() => removeEmergencyContact(contact._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={contact.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    value={contact.phoneNumber}
                    onChange={(e) =>
                      handleInputChange(index, "phoneNumber", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={contact.email}
                    onChange={(e) =>
                      handleInputChange(index, "email", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Relationship *</Label>
                  <Select
                    value={contact.relationship}
                    onValueChange={(value) =>
                      handleInputChange(index, "relationship", value)
                    }
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
    </form>
  );
}
