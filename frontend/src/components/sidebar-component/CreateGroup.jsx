import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useChatStore } from "../../store/useChatStore";
import { useGroupChatStore } from "../../store/useGroupChatStore";
import { X } from "lucide-react";

function CreateGroup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { users } = useChatStore();
  const { createGroup,} = useGroupChatStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (searchTerm === "") {
      setSuggestions(users);
    } else {
      const result = users.filter(
        (user) =>
          user.fullName &&
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSuggestions(result);
    }
  }, [searchTerm, users]);

  const handleSelectUser = (user) => {
    console.log("user", user);
    setSelectedUsers([...selectedUsers, user]);
    const updatedSuggestions = suggestions.filter(
      (selectedUser) => selectedUser._id !== user._id
    );
    setSuggestions(updatedSuggestions);
    inputRef.current.focus();
  };

  const handleRemoveUser = (user) => {
    console.log("selectedUsers", selectedUsers);
    const updatedUsers = selectedUsers.filter(
      (selectedUser) => selectedUser._id !== user._id
    );
    console.log("updatedUsers", updatedUsers);
    setSelectedUsers(updatedUsers);
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      selectedUsers.length > 0
    ) {
      const lastUser = selectedUsers[selectedUsers.length - 1];
      handleRemoveUser(lastUser);
    } else if (
      e.key === "Enter" &&
      activeSuggestion >= 0 &&
      activeSuggestion < suggestions.users.length
    ) {
      handleSelectUser(suggestions.users[activeSuggestion]);
    }
  };
  
  // Handle form submission
  const onSubmit = (data) => {
    createGroup({ ...data, contacts: selectedUsers });
    setInputValue("");
    setSelectedUsers([]);

  };

  const Pill = ({ user }) => {
    return (
      <div className="flex gap-2 justify-center items-center p-2 bg-zinc-900/60 rounded-lg">
        <img
          src={user.prifilePic || "/avatar.png"}
          alt={`${user.fullName}`}
          className="size-5"
        />
        <div className="text-md mt-[-5px] flex gap-2">
          {user.fullName}
          <X
            className="size-4 hover:bg-zinc-600 rounded-full p-0.5"
            onClick={() => handleRemoveUser(user)} // Wrap in arrow function
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 items-center justify-center w-full mt-5"
      >
        {/* Group Name */}
        <div className="w-full">
          <input
            id="groupName"
            type="text"
            placeholder="Enter group name"
            className="input input-bordered w-full "
            {...register("groupName", { required: "Group name is required" })}
          />
          {errors.groupName && <p>{errors.groupName.message}</p>}
        </div>
        {/* select members */}

        <div className="w-full flex">
          <div className="w-full flex items-center flex-wrap gap-2 p-2 py-3 border border-[#383F47] rounded-lg">
            {/* Pills */}
            {selectedUsers.map((user) => {
              return <Pill key={user.email} user={user} />;
            })}
            {/* input field with search suggestions */}
            <div className="flex flex-col w-full gap-5 ">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setSearchTerm(e.target.value.trim());
                  setInputValue(e.target.value.trim());
                  console.log("inputValue", inputValue);
                }}
                placeholder="Search For a User..."
                onKeyDown={handleKeyDown}
                className="w-full border-none focus:outline-none h-5 p-1 py-4 bg-transparent mt-2 bg-red-700"
              />
              {/* Search Suggestions  #1d232a*/}
              <ul
                className={`max-h-72  overflow-y-scroll list-none  border-zinc-900 w-full ${
                  searchTerm === "" ? "hidden" : "flex flex-col"
                }`}
              >
                {suggestions.map((user, index) => (
                  <li
                    className={`flex items-center gap-2 p-2 cursor-pointer border-b border-none rounded-lg hover:bg-zinc-900/60`}
                    key={user._id}
                    onClick={() => handleSelectUser(user)}
                  >
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt=""
                      className="size-5 object-contain rounded-full"
                    />
                    <span className=" text-md text-white/80 ml-3">
                      {user.fullName}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {user.email}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full">
          Create Group
        </button>
      </form>
    </div>
  );
}

export default CreateGroup;
