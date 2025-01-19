import { X, Pencil } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useGroupChatStore } from "../store/useGroupChatStore";
import GroupInfo from "./chatheader-component/GroupInfo";

const ChatHeader = () => {
  const {
    selectedUser,
    setSelectedUser,
    selectedChatType,
    setSelectedChatType,
  } = useChatStore();
  const { selectedGroup, setSelectedGroup } = useGroupChatStore();
  const { onlineUsers } = useAuthStore();

  if (selectedChatType === "contact") {
    return (
      <div className="p-2.5 border-b border-base-300 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="avatar">
              <div className="size-10 rounded-full relative">
                <img
                  src={selectedUser?.profilePic || "/avatar.png"}
                  alt={selectedUser?.fullName}
                />
              </div>
            </div>

            {/* User info */}
            <div>
              <h3 className="font-medium">{selectedUser?.fullName}</h3>
              <p className="text-sm text-base-content/70">
                {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          {/* Close button */}

          <button
            onClick={() => {
              setSelectedUser(null);
              setSelectedGroup(null);
              setSelectedChatType(null);
            }}
          >
            <X />
          </button>
        </div>
      </div>
    );
  }

  if (selectedChatType === "group") {
    return (
      <div className="p-2.5 border-b border-base-300 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="avatar">
              <div className="size-10 rounded-full relative">
                <img
                  src={selectedGroup?.coverImage || "/avatar.png"}
                  alt={selectedGroup?.name}
                />
              </div>
            </div>

            {/* User info */}
            <div>
              <h3 className="font-medium">{selectedGroup?.name}</h3>
            </div>
          </div>
          <div className="flex items-center gap-5 text-lg">
            <button
              className=""
              onClick={() => document.getElementById("my_modal_2").showModal()}
            >
              <Pencil className="size-5" />
            </button>
            {/* Close button */}
            <button
              onClick={() => {
                setSelectedUser(null);
                setSelectedGroup(null);
                setSelectedChatType(null);
              }}
            >
              <X />
            </button>
          </div>
        </div>
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box w-[85vw] sm:w-full">
            <form
              method="dialog"
              className="flex intems-center justify-between mt-[-17px] mr-[-15px]"
            >
              <div className="flex items-center justify-center text-lg pl-1 pt-1">
                Group Info
              </div>
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost ">✕</button>
            </form>
            <GroupInfo />
          </div>
        </dialog>
      </div>
    );
  }
};
export default ChatHeader;
