// client/src/components/ChatBox/Mesaage.jsx
import React from "react";

export default function Message({ item }) {
  const parsedData = JSON.parse(localStorage.getItem("chat-app-login-user-data")) || {};
  const isAI = item.sender === "Chatbot";
 // const isAnonymSender = typeof item.sender === "string" && item.sender.startsWith("Anonym_");
  const isSelf = !isAI  && parsedData._id === (typeof item.sender === "object" ? item.sender._id : item.sender);

  const createdAt = new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  console.log("Message item:", item);

  const avatarSrc = isAI
    // ? "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
    // : isAnonymSender
    ? "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    : typeof item.sender === "object" && item.sender.pic
    ? item.sender.pic
    : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
  <div className={`flex flex-col ${isSelf ? "items-end" : "items-start"} m-3`}>
    <div className={`flex gap-2 mb-1 ${isSelf ? "" : "flex-row-reverse"}`}>
      <div className={`${isSelf ? "text-right" : "text-left"}`}>
        <div
          className={`p-2 text-sm max-w-lg break-words rounded-lg ${
            isAI
              ? "bg-purple-100 text-purple-900 border border-purple-300"
              : isSelf
              ? "bg-primary-800 text-primary-50 rounded-l-lg rounded-tr-lg"
              : "bg-gray-200 text-gray-800 rounded-r-lg rounded-tl-lg"
          }`}
          data-kt-element="message-sender"
        >
          {isAI && <span className="text-xs font-semibold text-purple-700 block mb-1">AI Chatbot</span>}
          {item.message || item.content || "No content"}
        </div>
        <span className="text-primary-50 text-xs px-1">{createdAt}</span>
      </div>
      <div className="bg-primary-50 rounded-full w-9 h-9 flex items-center justify-center">
        <img alt="Avatar" src={avatarSrc} className="w-8 h-8 rounded-full" />
      </div>
    </div>
  </div>
);
}