import React, { useEffect, useState } from "react";
import { BsEmojiSmile, BsSendFill } from "react-icons/bs";
import Message from "./ChatBox/Mesaage";
import ChatHeader from "./ChatBox/ChatHeader";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/white-logo.png";
import { toast, ToastContainer } from "react-toastify";
import ScrollableFeed from "react-scrollable-feed";
import { sendMessage, setWebSocketReceivedMessage } from "../../redux/appReducer/action";
import { FaGithub } from "react-icons/fa";
import axios from "axios";
//import { GoogleGenerativeAI } from "@google/generative-ai";

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
  
  // const genAi = new GoogleGenerativeAI({
  //   apiKey: "AIzaSyBkDRkmr-YTM5YiNw096PmoDwu3ITjUqV0",
  // });
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
    // user_id = selectedUserForChat._id
    const userData = JSON.parse(localStorage.getItem("chat-app-login-user-data"));
    const user_id = userData?.user?._id || userData?._id;
    if (!user_id) {
      toast.error("User not logged in");
      return;
    }
  
    
  
    try {
      let prompt = "";
  
      if (userInput.includes("error") || userInput.toLowerCase().includes("exception")) {
        prompt = `
          Jelaskan error berikut secara jelas dan berikan solusi jika ada:
          ---
          ${userInput}
          ---
          Jika memungkinkan, berikan contoh perbaikan kode.`;
      } else if (
        userInput.includes("function") ||
        userInput.includes(";") ||
        userInput.includes("{")
      ) {
        prompt = `
          Berdasarkan potongan kode berikut, carikan referensi repository GitHub open-source yang relevan, 
          dan berikan sedikit penjelasan:
          ---
          ${userInput}
          ---
          Format balasan:
          - Penjelasan singkat
          - Daftar repository dengan nama & link`;
      } else {
        prompt = `Bantu jawab atau beri respon yang relevan untuk pesan ini: ${userInput}`;
      }
  
      // Ganti dengan endpoint lokal kamu
      setAiLoading(true);
      const response = await axios.post("http://localhost:8080/api/ai/ask",{
        prompt: prompt.trim(),
        user_id: user_id,
      });
  
      const aiReply = response.data.reply || "⚠️ Tidak ada balasan dari AI.";
      setAiResponse(aiReply);
    } catch (error) {
      console.error("Error contacting AI:", error);
      setAiResponse("⚠️ Gagal menghubungi AI lokal.");
    } finally {
      setAiLoading(false);
    }
  };
  
  // const handleAiSupport = async () => {
  //   if (!userInput.trim()) return;

  //   setAiLoading(true);
  //   try {
  //     const model = genAi.getGenerativeModel({ model: "gemini-2.5-pro-preview-03-25" });

  //     let prompt = "";
  //     if (userInput.includes("error") || userInput.toLowerCase().includes("exception")) {
  //       prompt = `
  //         Jelaskan error berikut secara jelas dan berikan solusi jika ada:
  //         ---
  //         ${userInput}
  //         ---
  //         Jika memungkinkan, berikan contoh perbaikan kode.`;
  //     } else if (userInput.includes("function") || userInput.includes(";") || userInput.includes("{")) {
  //       prompt = `
  //         Berdasarkan potongan kode berikut, carikan referensi repository GitHub open-source yang relevan, 
  //         dan berikan sedikit penjelasan:
  //         ---
  //         ${userInput}
  //         ---
  //         Format balasan:
  //         - Penjelasan singkat
  //         - Daftar repository dengan nama & link`;
  //     } else {
  //       prompt = `Bantu jawab atau beri respon yang relevan untuk pesan ini: ${userInput}`;
  //     }

  //     const result = await model.generateContent(prompt);
  //     const response = await result.response;
  //     const text = await response.text();
  //     setAiResponse(text);
  //   } catch (error) {
  //     setAiResponse("⚠️ Gagal menghubungi AI.");
  //   } finally {
  //     setAiLoading(false);
  //   }
  // };

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
      <div className="flex flex-col h-4/5 mt-8 bg-primary-600/50 rounded-lg px-4 py-2 pb-4">
        <div className="flex flex-col items-center justify-center h-full">
          <img className="w-20 h-20 mr-2" src={logo} alt="logo" />
          <p className="text-white">Enjoy Your Chat!</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <ChatHeader />
      <div className="flex flex-col bg-gradient-to-r from-purple-600 via-fuchsia-500 to-green-400/80 rounded-bl-lg rounded-br-lg px-4 py-2 pb-4">
        <div className="flex h-full flex-col max-h-[75vh] overflow-y-auto bg-primary-400  rounded-lg mb-2">
          {getMessageProcessing && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
              <span className="mr-2 text-white">Loading Messages</span>
            </div>
          )}
          <ScrollableFeed>
            {Array.isArray(getMessageData) && getMessageData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <img className="w-20 h-20 mr-2" src={logo} alt="logo" />
                <p className="text-white">Start Chating!</p>
              </div>
            ) : (
              Array.isArray(getMessageData) && getMessageData.map((item) => <Message item={item} key={item.id} />)
            )}
          </ScrollableFeed>
          {aiResponse && (
            <div className="bg-white text-sm text-gray-800 rounded-lg p-3 shadow mt-2 border-l-4 border-purple-500 whitespace-pre-line">
              <strong>🤖 AI Response:</strong>
              <div>{aiResponse}</div>
            </div>
          )}
        </div>
        <div className="relative mt-2">
          <input
            disabled={sendMessageProcessing}
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
            type="text"
            className="border border-gray-300 bg-primary-50 text-primary-900 font-semibold sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 "
            placeholder="Type your message..."
          />
          <button type="button" className="absolute inset-y-0 right-10 px-8 py-2.7 text-primary-800 focus:outline-none">
            <BsEmojiSmile className="w-5 h-5" />
          </button>
          <button
            disabled={sendMessageProcessing}
            type="button"
            className="absolute inset-y-0  right-1 top-1 bottom-1 px-2.5 py-1 rounded-lg hover:bg-primary-700 bg-primary-800 text-primary-100 focus:outline-none"
            onClick={handleSendMessage}
          >
            {sendMessageProcessing ? (
              <div className="flex items-center justify-center">
                <span className="mr-2">Sending</span>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </div>
            ) : (
              "Send"
            )}
          </button>
          <button
            disabled={sendMessageProcessing || aiLoading}
            type="button"
            className="absolute inset-y-0 right-24 top-1 bottom-1 px-2.5 py-1 rounded-lg hover:bg-purple-700 bg-purple-800 text-white focus:outline-none"
            onClick={handleAiSupport}
          >
            <FaGithub className="inline-block mr-1" />
            {aiLoading ? "Thinking..." : "Ask AI"}
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
