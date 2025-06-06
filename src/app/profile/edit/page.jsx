"use client"
import React from "react";
import { clientGet } from "@/utils/clientApi";
import { useState, useEffect } from "react";
import ProfileEditForm from "@/components/ProfileEditForm";
function ProfileEdit() {
  const [profile, setProfile] = useState(null);
  const fetchUserProfile = async () => {
    try {
      const response = await clientGet("/users/patient/profile");
      console.log(response);
      setProfile(response.data);
    } catch (err) {
      console.log("Something went wrong", err);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);
  return profile && <ProfileEditForm initialData={profile} />;
}

export default ProfileEdit;
