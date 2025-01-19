import React, { useState } from "react";
import { Camera } from "lucide-react";
import { useGroupChatStore } from "../../store/useGroupChatStore";
import { useAuthStore } from "../../store/useAuthStore";

function GroupInfo() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [updatingGroup, setUpdatingGroup] = useState(false);
  const { selectedGroup } = useGroupChatStore();
  const {updateGroupProfile} =useAuthStore();


  console.log(selectedGroup);
  
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUpdatingGroup(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateGroupProfile({ profilePic: base64Image , id: selectedGroup._id});
    };
    setUpdatingGroup(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <img
          src={selectedImage || selectedGroup.coverImage || "/avatar.png"}
          alt="Profile"
          className="size-32 rounded-full object-cover border-4 "
        />
        <label
          htmlFor="avatar-upload"
          className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${updatingGroup ? "animate-pulse pointer-events-none" : ""}
                `}
        >
          <Camera className="w-5 h-5 text-base-200" />
          <input
            type="file"
            id="avatar-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={updatingGroup}
          />
        </label>
      </div>
      <p className="text-sm text-zinc-400">
        {updatingGroup
          ? "Uploading..."
          : "Click the camera icon to update your photo"}
      </p>
    </div>
  );
}

export default GroupInfo;
