import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessage, selectUserForChat } from "../../../redux/appReducer/action";

const DisplayChatCard = ({ item }) => {
  const webSocket = useSelector((state) => state.appReducer.webSocket);
  const parsedData = JSON.parse(localStorage.getItem("chat-app-login-user-data"));
  const dispatch = useDispatch();

  // Select User For Chat
  const handelSelectUserForChat = () => {
    dispatch(selectUserForChat(item));
    dispatch(getMessage(item._id));
    webSocket.emit("join chat", item._id);
  };

  const isAIChat= item.type === "AI_CHATBOT" || item.isAI;

  // Find the user from item that doesn't match the _id in parsedData
  const selectedUser = isAIChat 
  ? { name: "AI Assistant", pic: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"}:item.users.find((user) => user._id !== parsedData._id);

  return (
    <div
      onClick={handelSelectUserForChat}
      className="bg-gradient-to-r from-purple-600/50 via-fuchsia-500/50 to-green-400/50 cursor-pointer rounded-lg shadow-md mt-3 hover:shadow-lg hover:ring-2 hover:ring-primary-200 hover:bg-gradient-to-r hover:from-purple-600/60 hover:via-fuchsia-500/60 hover:to-green-400/60 transition-shadow duration-200"
    >
      <div className="flex items-center space-x-4 p-2">
        <div className="flex-shrink-0">
          <img className="w-10 h-10 rounded-full" src={item.isGroupChat ? "https://cdn-icons-png.flaticon.com/512/2043/2043173.png" : selectedUser.pic} alt={`${item.name} image`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-md font-semibold text-primary-800 truncate ">{item.isGroupChat ? item.chatName : selectedUser.name}</p>
          <p className="text-xs font-semibold text-primary-400 truncate ">{item.latestMessage ? item.latestMessage.message : ""}</p>
        </div>
      </div>
    </div>
  );
};

export default DisplayChatCard;
