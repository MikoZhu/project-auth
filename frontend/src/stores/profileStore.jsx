import { create } from "zustand";
const apiEnv = import.meta.env.VITE_BACKEND_API;
import { userStore } from "../stores/userStore";

export const profileStore = create((set) => ({
  // Set the initial data
  profile: [],

  // Initialize the userId state
  userID: userStore.userID,

  handleAddProfile: async (firstName, lastName, phone) => {
    if (!lastName || !firstName || !phone) {
      alert("Please enter last name, first name, and phone");
      return;
    }

    try {
      const response = await fetch(`${apiEnv}/profile`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("accessToken"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          important,
          flower,
          color,
        }),
      });

      const data = await response.json();
      if (data.success) {
        set({ firstName, lastName, phone, important, flower, color });
        alert("Add profile successful!");
      } else {
        alert(data.response || "Add profile not successful!");
      }
    } catch (error) {
      console.error("Add profile error:", error);
      alert("An error occurred during adding profile process");
    }
  },
}));
