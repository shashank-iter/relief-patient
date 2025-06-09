"use client";
import React from "react";
import { clientGet } from "@/utils/clientApi";
import { useState, useEffect } from "react";
import PersonalInformationForm from "@/components/ProfileComponents/PersonalInformationForm";
import MedicalHistoryForm from "@/components/ProfileComponents/MedicalHistoryForm";
import EmergencyContactsForm from "@/components/ProfileComponents/EmergencyContactsForm";
import { withAuth } from "@/components/withAuth";
import Loader from "@/components/Loader";

function ProfileEdit() {
  const [profile, setProfile] = useState(null);
  const [reloadProfile, setReloadProfile] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await clientGet("/users/patient/profile");
      console.log(response);
      setProfile(response.data);
    } catch (err) {
      console.log("Something went wrong", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [reloadProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="">
      {profile && (
        <PersonalInformationForm
          initialData={profile}
          onRefresh={fetchUserProfile}
          reloadProfile={reloadProfile}
          setReloadProfile={setReloadProfile}
        />
      )}
      {profile && (
        <MedicalHistoryForm
          initialData={profile}
          onRefresh={fetchUserProfile}
          reloadProfile={reloadProfile}
          setReloadProfile={setReloadProfile}
        />
      )}
      {profile && (
        <EmergencyContactsForm
          initialData={profile}
          onRefresh={fetchUserProfile}
          reloadProfile={reloadProfile}
          setReloadProfile={setReloadProfile}
        />
      )}
    </div>
  );
}

export default withAuth(ProfileEdit);
