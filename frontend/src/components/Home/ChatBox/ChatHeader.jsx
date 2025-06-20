import React from "react";
import ChatDetails from "./ChatDetails";
import { useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import UpdateGroup from "./UpdateGroup";

export default function ChatHeader() {
  const selectedUserForChat = useSelector((state) => state.appReducer.selectedUserForChat);
  const loginUser = JSON.parse(localStorage.getItem("chat-app-login-user-data"));

  // Find the user from selectedUserForChat that doesn't match the _id in localStorageData
  const selectedUser = selectedUserForChat.users.find((user) => user._id !== loginUser._id);

  return (
    <div className="flex mt-2 mb-2 justify-between items-center h-12 text-black font-bold dark:text-white">
      <div className="flex items-center pt-2 ml-2 gap-2">
        <div className={`bg-primary-50 rounded-full w-9 h-9 flex items-center justify-center`}>
          <img className="w-8 h-8 rounded-full" src={selectedUserForChat.isGroupChat ? "https://cdn-icons-png.flaticon.com/512/2043/2043173.png" : selectedUser.pic} alt={"not found"} />
        </div>
        <h1 className="text-2xl">{selectedUserForChat.isGroupChat ? selectedUserForChat.chatName : selectedUser.name}</h1>
      </div>

      <div className="flex h-full mt-2 gap-1 items-center">
        {selectedUserForChat.isGroupChat && <ChatDetails />}
        {selectedUserForChat.isGroupChat && selectedUserForChat.groupAdmin === loginUser._id ? <UpdateGroup /> : ""}
      </div>
    </div>
  );
}
