import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChats } from "../../redux/appReducer/action";
import CreateGroupChat from "./AllChats/CreateGroupChat";
import JoinGroupChat from "./AllChats/JoinGroupChat";
import DisplayChatCard from "./AllChats/DisplayChatCard";

export default function AllChats() {
  const dispatch = useDispatch();
  const allChat = useSelector((state) => state.appReducer.allChat);
  const createGroupChatSuccess = useSelector((state) => state.appReducer.createGroupChatSuccess);
  const singleUserChatsuccess = useSelector((state) => state.appReducer.singleUserChatsuccess);
  const addMembersInGroupSuccess = useSelector((state) => state.appReducer.addMembersInGroupSuccess);
  const isRenameGroupSuccess = useSelector((state) => state.appReducer.isRenameGroupSuccess);
  const removeMembersFromGroupSuccess = useSelector((state) => state.appReducer.removeMembersFromGroupSuccess);

  useEffect(() => {
    dispatch(getChats());
  }, [createGroupChatSuccess, singleUserChatsuccess, addMembersInGroupSuccess, removeMembersFromGroupSuccess, isRenameGroupSuccess]);

  return (
    <div className="flex flex-col flex-grow p-2 mt-3 h-[calc(100vh-2rem)]">
      {/* Tombol Create & Join Group secara horizontal */}
      <div className="flex flex-row gap-3 mb-4">
        <CreateGroupChat />
        <JoinGroupChat />
      </div>

      {/* Container daftar chat */}
      <div className="flex flex-col flex-grow bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border-2 border-black dark:border-gray-600 rounded-xl shadow-lg p-3 transition-colors">
        <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-100 tracking-widest">Chats</h2>
        <div className="flex-1 max-h-full p-1 overflow-y-auto custom-scrollbar">
          {allChat?.length === 0 ? (
            <div className="text-center text-gray-400 dark:text-gray-500 py-8">No chats yet.</div>
          ) : (
            allChat.map((item) => (
              <DisplayChatCard
                item={item}
                key={item.id}
               
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}