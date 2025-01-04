import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import ChatHeader from "./Chatheader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { formatMessageTime } from "../lib/utils.js";
import { ArrowDownToLine, X } from "lucide-react";
import axios from "axios";

function ChatContainer() {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeToMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);
  const [openImage, setOpenImage] = useState(false);
  const [image, setImage] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    return () => {
      unsubscribeToMessages();
    };
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeToMessages]);

  useEffect(() => {
    if (messagesEndRef.current && messages) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const downloadImage = async (url) => {
    setIsDownloading(true);

    try {
      const response = await axios.get(url, {
        responseType: "blob",
      });
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", url.split("/").pop()); // Use the file name from the URL
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error("File download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="relative flex-1 flex flex-col overflow-auto ">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            } `}
            ref={messagesEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt=""
                />
              </div>
            </div>

            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                  onClick={() => {
                    setOpenImage(true);
                    setImage(message.image);
                  }}
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
            <div className="mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
          </div>
        ))}
      </div>
      {openImage && (
        <div className=" absolute h-full w-full z-10 backdrop-blur-lg ">
          <div className="flex justify-center w-full gap-3 mt-5">
            <button
              className="p-3 rounded-full bg-zinc-800/80"
              onClick={() => {
                downloadImage(image);
              }}
            >
              <ArrowDownToLine />
            </button>
            <button
              className="p-3 rounded-full bg-zinc-800/80"
              onClick={() => {
                setOpenImage(false);
              }}
            >
              <X />
            </button>
          </div>
          <div className="w-full px-1 py-10 sm:p-10   flex justify-center items-center ">
            <img
              src={image}
              alt="Preview"
              className="object-contain h-[60vh] rounded-md shadow-lg"
            />
          </div>
        </div>
      )}
      <MessageInput />
    </div>
  );
}

export default ChatContainer;
