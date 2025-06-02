// client/src/components/AllChats/AllChats.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChats } from "../../redux/appReducer/action";
import CreateGroupChat from "./AllChats/CreateGroupChat";
import DisplayChatCard from "./AllChats/DisplayChatCard";


export default function AllChats() {
  const dispatch = useDispatch();
  const allChat = useSelector((state) => state.appReducer.allChat);
  const createGroupChatSuccess = useSelector((state) => state.appReducer.createGroupChatSuccess);
  const singleUserChatsuccess = useSelector((state) => state.appReducer.singleUserChatsuccess);
  const addMembersInGroupSuccess = useSelector((state) => state.appReducer.addMembersInGroupSuccess);
  const isRenameGroupSuccess = useSelector((state) => state.appReducer.isRenameGroupSuccess);
  const removeMembersFromGroupSuccess = useSelector((state) => state.appReducer.removeMembersFromGroupSuccess);

  const aiChat = {
    _id: "AI_CHATBOT",
    chatName: "AI Chatbot",
    isGroupChat: false,
    type: "AI CHATBOT",
    isAI: true,
    users: [{ _id: "AI_CHATBOT", name: "AI Chatbot", pic: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png" }],
    latestMessage: null,
  };

  useEffect(() => {
    dispatch(getChats());
  }, [dispatch, createGroupChatSuccess, singleUserChatsuccess, addMembersInGroupSuccess, removeMembersFromGroupSuccess, isRenameGroupSuccess]);

  return (
    <div className="flex flex-col flex-grow p-2 mt-3 rounded-lg z-10">
      <CreateGroupChat />
      <div className="bg-primary-600/5 mt-3 rounded-lg p-2">
        <div className="max-h-[72vh] p-2 overflow-y-auto">
          <DisplayChatCard item={aiChat} key={aiChat._id} />
          {allChat?.map((item) => (
            <DisplayChatCard item={item} key={item._id} />
          ))}
        </div>
      </div>
    </div>
  );
}