// client/src/components/ChatBox/ChatBox.js
import React, { useEffect, useState } from "react";
import { BsEmojiSmile, BsSendFill } from "react-icons/bs";
import { FaRobot } from "react-icons/fa";
import Message from "./ChatBox/Mesaage";
import ChatHeader from "./ChatBox/ChatHeader";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/white-logo.png";
import { toast, ToastContainer } from "react-toastify";
import ScrollableFeed from "react-scrollable-feed";
import { getAIResponse, sendMessage, setWebSocketReceivedMessage } from "../../redux/appReducer/action";
import axios from "axios";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL || "http://localhost:8080");

export default function ChatBox() {
  const selectedUserForChat = useSelector((state) => state.appReducer.selectedUserForChat);
  const sendMessageSuccess = useSelector((state) => state.appReducer.sendMessageSuccess);
  const sendMessageFail = useSelector((state) => state.appReducer.sendMessageFail);
  const sendMessageObj = useSelector((state) => state.appReducer.sendMessageObj);
  const sendMessageProcessing = useSelector((state) => state.appReducer.sendMessageProcessing);
  const notficationsMessages = useSelector((state) => state.appReducer.notficationsMessages);
  const getMessageProcessing = useSelector((state) => state.appReducer.getMessageProcessing);
  const getMessageData = useSelector((state) => state.appReducer.getMessageData);
  const currentUser = useSelector((state) => state.authReducer.sign_in_User);
  const isAnonym = useSelector((state) => state.authReducer.isAnonym);
  const anonymId = useSelector((state) => state.authReducer.anonymId);
  const anonymName = useSelector((state) => state.authReducer.anonymName);
  const webSocket = useSelector((state) => state.appReducer.webSocket);
  

  const [userInput, setUserInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const dispatch = useDispatch();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("Socket.IO connected");
  //   });
  //   socket.on("connect_error", (error) => {
  //     console.error("Socket.IO error:", error);
  //   });
  //   return () => {
  //     socket.off("connect");
  //     socket.off("connect_error");
  //   };
  // }, []);

  const handleSendMessage = () => {
    let obj = {
      content: userInput.trim(),
      chatId: selectedUserForChat._id,
    };
    if (!obj.content) {
      toast.warn("Please write a message to send", { position: "bottom-left", autoClose: 2000 });
    }
    dispatch(sendMessage(obj));
    setUserInput("");
  };

  const handleAiSupport = async () =>{
    if(!userInput.trim()){
      toast.warn("Please write a message to ask AI", { position: "bottom-left", autoClose: 2000 });
      return;
    }
    dispatch(getAIResponse(userInput, selectedUserForChat._id));
    setUserInput("");
  }
  useEffect(() => {
    if (!sendMessageProcessing && !sendMessageFail && sendMessageSuccess && sendMessageObj && selectedUserForChat) {
      webSocket.emit("new message", sendMessageObj);
      // dispatch(setWebSocketReceivedMessage(getMessageData, sendMessageObj, notficationsMessages, selectedUserForChat));
    }
    if (!sendMessageProcessing && sendMessageFail) {
      toast.error("Message not sent. Try again.", { position: "bottom-left", autoClose: 2000 });
    }
  }, [sendMessageSuccess, sendMessageFail, sendMessageProcessing, dispatch, getMessageData, notficationsMessages, selectedUserForChat, sendMessageObj]);


  useEffect(() =>{
    const handleNewMessageRecieved = (newMessageRec) => {
      dispatch(setWebSocketReceivedMessage(getMessageData, newMessageRec, notficationsMessages, selectedUserForChat))
    };
    webSocket.on("message recieved", handleNewMessageRecieved);
    return() =>{
      webSocket.off("message recieved");
    };
  }, [webSocket]);

  if (!selectedUserForChat) {
    return (
      <div className="flex flex-col h-full mt-6 bg-gradient-to-br from-indigo-900 to-purple-800 rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center justify-center h-full">
          <img className="w-28 h-28 mb-4 animate-pulse" src={logo} alt="Collabify Logo" />
          <p className="text-white text-xl font-bold tracking-wide">Welcome to Collabify! Start a chat now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      <div className="flex flex-col flex-grow bg-white/95 backdrop-blur-md rounded-b-2xl shadow-lg p-6">
        <div className="flex flex-col h-[calc(100vh-14rem)] bg-gray-50/80 rounded-xl p-5 overflow-y-auto shadow-inner">
          {getMessageProcessing ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-indigo-600"></div>
              <span className="mt-3 text-indigo-900 font-semibold">Loading Messages...</span>
            </div>
          ) : (
            <ScrollableFeed>
              {Array.isArray(getMessageData) && getMessageData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <img className="w-24 h-24 mb-4" src={logo} alt="Collabify Logo" />
                  <p className="text-indigo-900 font-semibold">No messages yet. Start chatting!</p>
                </div>
              ) : (
                Array.isArray(getMessageData) &&
                getMessageData.map((item) => <Message item={item} key={item._id} />)
              )}
            </ScrollableFeed>
          )}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="relative flex-grow">
            <input
              disabled={sendMessageProcessing}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              type="text"
              className="w-full p-3.5 pr-36 rounded-full bg-white border border-gray-200 text-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-md placeholder-gray-400"
              placeholder="Type your message..."
            />
            <button
              type="button"
              className="absolute right-28 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <BsEmojiSmile className="w-5 h-5" />
            </button>
            <button
              disabled={sendMessageProcessing || aiLoading}
              type="button"
              className={`absolute right-16 top-1/2 transform -translate-y-1/2 px-3 py-1.5 rounded-full text-white text-sm font-medium transition-all ${
                aiLoading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
              }`}
              onClick={handleAiSupport}
            >
              <FaRobot className="inline-block mr-1 w-4 h-4" />
              {aiLoading ? "Thinking" : "Ask AI"}
            </button>
            <button
              disabled={sendMessageProcessing}
              type="button"
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 rounded-full text-white text-sm font-medium transition-all ${
                sendMessageProcessing ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              onClick={handleSendMessage}
            >
              {sendMessageProcessing ? (
                <div className="flex items-center">
                  {/* <span className="mr-1 text-xs">Sending</span> */}
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                </div>
              ) : (
                <BsSendFill className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}