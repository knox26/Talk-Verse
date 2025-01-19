import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import SidebarSkeleton from "./skeletons/SidebarSkeleton.jsx";
import { Plus, User, Users } from "lucide-react";
import CreateGroup from "./sidebar-component/CreateGroup.jsx";
import { useGroupChatStore } from "../store/useGroupChatStore.js";


function Sidebar() {
  const {
    getUsers,
    users,
    isUserLoading,
    setSelectedUser,
    selectedUser,
    setSelectedChatType,
    selectedChatType,
  } = useChatStore();
  const { getGroups, groups, selectedGroup, setSelectedGroup } =
    useGroupChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers, getGroups]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUserLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <aside className=" h-full w-12 xs:w-14 sm:w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 ">
      {/* userContcts */}
      <div className=" border-b border-base-300 w-full px-5 py-2.5  ">
        <div className="flex items-center justify-center lg:justify-start gap-2 size-6 w-full ">
          <div className="flex items-center gap-4 ">
            <div>
              <User className=" size-5 sm:size-6 lg:size-5" />
            </div>
            <div className="font-medium hidden lg:block">Contacts</div>
          </div>
        </div>
        {/* TODO: Online filter toggle */}
        <div className="mt-2 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>
      <div className=" w-full overflow-y-auto">
        <div className=" flex flex-col  w-full">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setSelectedChatType("contact");
                setSelectedGroup(null);
              }}
              className={`
            w-full p-2 flex items-center gap-3
            hover:bg-zinc-900/70 hover:rounded-md transition-colors
            ${
              selectedUser?._id === user._id
                ? "bg-zinc-900/70 ring-1 ring-base-300 rounded-xl"
                : ""
            }
          `}
            >
              <div className=" mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="  size-8 sm:size-11 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">
              No online users
            </div>
          )}
        </div>
      </div>

      {/* Groups */}
      <div className="border-b border-t border-base-300 w-full px-5 py-3  ">
        <div className="flex flex-col lg:flex-row my-2   items-center justify-center lg:justify-between gap-1 lg:gap-0 size-6 w-full">
          <div className="flex items-center gap-4 ">
            <div>
              <Users className=" size-5 sm:size-6" />{" "}
            </div>
            <div className="font-medium hidden lg:block">Groups</div>
          </div>
          <div className="rounded-full hover:bg-zinc-900/70 flex justify-center items-center p-1">
            <button
              className=""
              onClick={() => document.getElementById("my_modal_3").showModal()}
            >
              <Plus className="size-5 sm:size-6" />
            </button>
            <dialog id="my_modal_3" className="modal">
              <div className="modal-box w-[85vw] sm:w-full">
                <form
                  method="dialog"
                  className="flex intems-center justify-between mt-[-17px] mr-[-15px]"
                >
                  <div className="flex items-center justify-center text-xl pl-1 pt-1">
                    Fill the information
                  </div>
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm btn-circle btn-ghost ">
                    ✕
                  </button>
                </form>
                <CreateGroup />
              </div>
            </dialog>
          </div>
        </div>
      </div>
      <div className=" h-1/2 w-full overflow-y-auto">
        <div className=" flex flex-col  w-full">
          {groups.map((group) => (
            <button
              key={group._id}
              onClick={() => {
                setSelectedUser(null);
                setSelectedGroup(group);
                setSelectedChatType("group");
              }}
              className={`
            w-full p-2 flex items-center gap-3
            hover:bg-zinc-900/70 hover:rounded-md transition-colors
            ${
              selectedGroup?._id === group._id
                ? "bg-zinc-900/70 ring-1 ring-base-300 rounded-xl"
                : ""
            }
          `}
            >
              <div className=" mx-auto lg:mx-0">
                <img
                  src={group.profilePic || "/group.png"}
                  alt={group.name}
                  className="  size-8 sm:size-11 object-cover rounded-full"
                />
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{group.name}</div>
              </div>
            </button>
          ))}

          {groups.length === 0 && (
            <div className="text-center text-zinc-500 py-4">
              No groups found
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
