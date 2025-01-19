import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useGroupChatStore = create((set, get) => ({
  groupMessages: [],
  members: [],
  groups: [],
  selectedGroup: null,
  isGroupLoading: false,
  isGroupMessagesLoading: false,

  setSelectedGroup: (user) => {
    set({ selectedGroup: user });
  },

  createGroup: async (data) => {
    try {
      if (!data.groupName || !data.contacts[0]) {
        return toast.error("Group name and members are required");
      }

      const res = await axiosInstance.post(`/messages/create-group`, {
        groupName: data.groupName,
        members: data.contacts,
      });
      if (res.status === 200) {
        toast.success("Group created successfully");
      }
      console.log("res", res);
    } catch (error) {
      toast.error("group with this name already exist");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  getGroups: async () => {
    set({ isGroupLoading: true });
    try {
      const res = await axiosInstance.get("/messages/groups");
      set({ groups: res.data });
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      set({ isGroupLoading: false });
    }
  },
  getGroupMessages: async (groupId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(
        `/messages/get-group-messages/${groupId}`
      );
      set({ groupMessages: res.data });
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendGroupMessage: async (message) => {
    const { selectedGroup, groupMessages } = get();
    try {
      const response = await axiosInstance.post(
        `/messages/send-group-messages/${selectedGroup._id}`,
        message
      );
      set({ groupMessages: [...groupMessages, response.data] });
    } catch (error) {
      toast.error("Failed to send message");
      console.log("error", error);
    }
  },

  subscribeToGroupMessages: () => {
    const { selectedGroup, groupMessages } = get();
    const socket = useAuthStore.getState().socket;
   
    if (!selectedGroup) return;

    socket.on("newGroupMessage", (newMessage) => {
      if (newMessage.groupId !== selectedGroup._id) return;
    
      set({ groupMessages: [...get().groupMessages, newMessage] });
    });
   
  },

  unsubscribeToGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newGroupMessage");
  },
}));
