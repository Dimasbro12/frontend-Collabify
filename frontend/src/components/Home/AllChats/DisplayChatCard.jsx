import React from "react";
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

  // Find the user from item that doesn't match the _id in parsedData
  const selectedUser = item.users.find((user) => user._id !== parsedData._id);

  return (
    <div
      onClick={handelSelectUserForChat}
      className="cursor-pointer rounded-lg border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-shadow duration-150 mb-2 last:mb-0"
    >
      <div className="flex items-center space-x-4 p-2">
        <div className="flex-shrink-0">
          <img
            className="w-10 h-10 rounded-full border border-black dark:border-gray-600"
            src={
              item.isGroupChat
                ? "https://cdn-icons-png.flaticon.com/512/2043/2043173.png"
                : selectedUser.pic
            }
            alt={`${item.name} image`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-md font-semibold text-gray-900 dark:text-white truncate">
            {item.isGroupChat ? item.chatName : selectedUser.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-300 truncate">
            {item.latestMessage ? item.latestMessage.message : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisplayChatCard;