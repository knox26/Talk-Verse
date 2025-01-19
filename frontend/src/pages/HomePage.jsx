import React from "react";
import { useChatStore } from "../store/useChatStore.js";
import ChatContainer from "../components/ChatContainer.jsx";
import EmptyChatContainer from "../components/EmptyChatContainer.jsx";
import Sidebar from "../components/Sidebar.jsx";

function HomePage() {
  const { selectedChatType } = useChatStore();
  return (
    <div className="h-screen bg-base-200 ">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-6.5rem)]">
          <div className="flex h-full rounded-lg overflow-hidden ">
            <Sidebar />
            {selectedChatType === "contact" ? (
              <ChatContainer />
            ) : selectedChatType === "group" ? (
              <ChatContainer />
            ) : (
              <EmptyChatContainer />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
