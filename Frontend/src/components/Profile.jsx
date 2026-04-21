import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { userData, setUserData } = useContext(UserContext);
  const { token, serverUrl } = useContext(AuthContext);

  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ validation
    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await axios.put(
        `${serverUrl}/api/auth/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserData((prev) => ({
        ...prev,
        profilePic: res.data.profilePic,
      }));

    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#141427] p-0 rounded-xl flex flex-col items-center">

      {/* Profile Image */}
      <label className="cursor-pointer">
        <div className="w-24 h-24 rounded-full border-4 border-purple-500 overflow-hidden mt-2">
          {preview || userData?.profilePic ? (
            <img
              src={preview || userData.profilePic}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-3xl">
              👤
            </div>
          )}
        </div>

        <input
          type="file"
          className="hidden"
          onChange={handleImageUpload}
        />
      </label>

      {/* Info */}
      <h2 className="mt-2 text-lg font-semibold">
        {userData?.name || "User"}
      </h2>

      <p className="text-sm text-gray-400">
        {userData?.email || "user@example.com"}
      </p>

      {/* Upload status */}
      {uploading && (
        <p className="text-xs text-purple-400 mt-2">Uploading...</p>
      )}
    </div>
  );
}