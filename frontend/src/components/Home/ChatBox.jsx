import React, { useEffect, useState } from "react";
import { BsEmojiSmile, BsSendFill } from "react-icons/bs";
import Message from "./ChatBox/Mesaage";
import ChatHeader from "./ChatBox/ChatHeader";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/white-logo.png";
import { toast, ToastContainer } from "react-toastify";
import ScrollableFeed from "react-scrollable-feed";
import { sendMessage, setWebSocketReceivedMessage, getAIResponse } from "../../redux/appReducer/action";
import { FaGithub } from "react-icons/fa";
import axios from "axios";

export default function ChatBox() {
  const selectedUserForChat = useSelector((state) => state.appReducer.selectedUserForChat);
  const sendMessageSuccess = useSelector((state) => state.appReducer.sendMessageSuccess);
  const sendMessageFail = useSelector((state) => state.appReducer.sendMessageFail);
  const sendMessageObj = useSelector((state) => state.appReducer.sendMessageObj);
  const sendMessageProcessing = useSelector((state) => state.appReducer.sendMessageProcessing);

  const notficationsMessages = useSelector((state) => state.appReducer.notficationsMessages);
  const getMessageProcessing = useSelector((state) => state.appReducer.getMessageProcessing);
  const getMessageData = useSelector((state) => state.appReducer.getMessageData);
  const webSocket = useSelector((state) => state.appReducer.webSocket);
  const currentUser = useSelector((state) => state.authReducer.user);

  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const dispatch = useDispatch();

  const handleSendMessage = () => {
    let obj = {
      content: userInput.trim(),
      chatId: selectedUserForChat._id,
    };

    if (!obj.content) {
      toast.warn("Write something to send", { position: toast.POSITION.BOTTOM_LEFT });
    } else {
      dispatch(sendMessage(obj));
    }
  };

  const handleAiSupport = async () => {
    if (!userInput.trim()) return;
    try {
      setAiLoading(true);
      if (!userInput.trim()) {
        toast.warn("Please write a message to ask AI", { position: "bottom-left", autoClose: 2000 });
        return;
      }
      dispatch(getAIResponse(userInput, selectedUserForChat._id));
      setUserInput("");
    } catch (error) {
      console.error("Error contacting AI:", error);
      setAiResponse("⚠️ Gagal menghubungi AI lokal.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      webSocket.off("message received");
    };
  }, [webSocket]);

  useEffect(() => {
    if (!sendMessageProcessing && !sendMessageFail && sendMessageSuccess) {
      setUserInput("");
      webSocket.emit("new message", sendMessageObj);
      dispatch(setWebSocketReceivedMessage(getMessageData, sendMessageObj, notficationsMessages, selectedUserForChat));
    }

    if (!sendMessageProcessing && sendMessageFail && !sendMessageSuccess) {
      toast.error("Message not sent. Try again.", { position: toast.POSITION.BOTTOM_LEFT });
    }
  }, [sendMessageSuccess, sendMessageFail, sendMessageProcessing]);

  useEffect(() => {
    const handleNewMessageReceived = (newMessageRec) => {
      dispatch(setWebSocketReceivedMessage(getMessageData, newMessageRec, notficationsMessages, selectedUserForChat));
    };

    webSocket.on("message received", handleNewMessageReceived);

    return () => {
      webSocket.off("message received", handleNewMessageReceived);
    };
  }, [webSocket, selectedUserForChat, getMessageData]);

  if (!selectedUserForChat) {
    return (
      <div className="flex flex-col h-full bg-primary-600/50 rounded-lg px-4 py-2 pb-4 justify-center items-center">
        <img className="w-20 h-20 mb-2" src={logo} alt="logo" />
        <p className="text-white">Enjoy Your Chat!</p>
      </div>
    );
  }
return (
  <>
    <div className="flex flex-col flex-grow h-[calc(100vh-2rem)] bg-gradient-to-br from-purple-600 via-fuchsia-500 to-green-400/80 rounded-xl px-4 py-2 shadow-lg">
      {/* Header */}
      <div className="border-2 border-black dark:border-gray-700 rounded-t-lg bg-white/95 dark:bg-gray-900/90 px-4 py-3 flex-shrink-0">
        <ChatHeader />
      </div>
      {/* Scrollable area */}
      <div className="flex-1 flex flex-col overflow-y-auto border-x-2 border-b-2 border-black dark:border-gray-700 bg-white/95 dark:bg-gray-900/90 rounded-b-lg p-2">
        {getMessageProcessing && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
            <span className="mr-2 text-gray-700 dark:text-gray-200">Loading Messages</span>
          </div>
        )}
        <ScrollableFeed>
          {Array.isArray(getMessageData) && getMessageData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <img className="w-20 h-20 mb-2" src={logo} alt="logo" />
              <p className="text-gray-700 dark:text-gray-200">Start Chating!</p>
            </div>
          ) : (
            Array.isArray(getMessageData) && getMessageData.map((item) => <Message item={item} key={item.id} />)
          )}
        </ScrollableFeed>
      </div>
      {/* Input area */}
      <form
        className="flex items-center gap-2 mt-2"
        onSubmit={e => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <input
          disabled={sendMessageProcessing}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          type="text"
          className="flex-1 border-2 border-black dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 font-semibold rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 px-4 py-2"
          placeholder="Type your message..."
        />
        <button
          disabled={sendMessageProcessing}
          type="submit"
          className="flex items-center justify-center bg-gradient-to-r from-purple-700 via-fuchsia-600 to-green-500 hover:from-purple-800 hover:to-green-600 text-white rounded-lg p-2 transition-all border-2 border-black dark:border-gray-700 shadow"
          title="Send"
        >
          <BsSendFill size={22} />
        </button>
        <button
          disabled={sendMessageProcessing || aiLoading}
          type="button"
          className="flex items-center justify-center bg-gradient-to-r from-gray-700 via-purple-700 to-fuchsia-500 hover:from-gray-800 hover:to-fuchsia-600 text-white rounded-lg p-2 transition-all border-2 border-black dark:border-gray-700 shadow"
          onClick={handleAiSupport}
          title="Ask AI"
        >
          <FaGithub className="mr-1" />
          {aiLoading ? "Thinking..." : "Ask AI"}
        </button>
      </form>
    </div>
    <ToastContainer />
  </>
);

}