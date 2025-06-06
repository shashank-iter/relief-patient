"use client";
import React, { useEffect } from "react";
import { clientGet } from "@/utils/clientApi";
import { withAuth } from "@/components/withAuth";

function Profile() {
  const fetchUserProfile = async () => {
    try {
      const response = await clientGet("/users/patient/profile");
      console.log(response);
    } catch (err) {
      console.log("Something went wrong", err);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  return <div>Profile</div>;
}

export default withAuth(Profile);
