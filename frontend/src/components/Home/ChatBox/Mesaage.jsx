export default function Message({ item }) {
  const parsedData = JSON.parse(localStorage.getItem("chat-app-login-user-data")) || {};

  const isAI = item.isAi === true;

  const isAIForSelf =
    isAI &&
    (typeof item.receiver === "object"
      ? item.receiver._id === parsedData._id
      : item.receiver === parsedData._id);

  const isSelf =
    !isAI &&
    parsedData?._id &&
    (typeof item.sender === "object"
      ? item.sender?._id === parsedData._id
      : item.sender === parsedData._id);

  const createdAt = new Date(item.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Warna bubble AI untuk user yang berbeda
  let aiBubbleColor = "bg-white text-purple-900 border border-purple-400";
  if (isAIForSelf) {
    const colorMap = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-pink-100 text-pink-800",
      "bg-yellow-100 text-yellow-800",
    ];
    const idx =
      parsedData._id.charCodeAt(parsedData._id.length - 1) % colorMap.length;
    aiBubbleColor = colorMap[idx];
  }

  // Sumber avatar
  const avatarSrc = isAI
    ? "https://cdn-icons-png.flaticon.com/512/149/149071.png" // icon chatbot
    : item.sender && typeof item.sender === "object" && item.sender.pic
    ? item.sender.pic
    : "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"; // default no-profile

  // Nama pengirim
  const senderName =
  isAI
    ? "AI Chatbot"
    : item.sender && typeof item.sender === "object" && item.sender.name
    ? item.sender.name
    : "AI Chatbot";

  return (
    <div className={`flex flex-col ${isSelf ? "items-end" : "items-start"} m-3`}>
      <div className={`flex gap-2 items-end ${isSelf ? "flex-row-reverse" : ""}`}>
        {/* Avatar */}
        <div className="w-9 h-9 flex items-center justify-center">
          <img
            alt="Avatar"
            src={avatarSrc}
            className="w-8 h-8 rounded-full"
          />
        </div>

        {/* Bubble & Nama */}
        <div className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
          {/* Nama pengirim */}
          <span
            className={`text-xs font-semibold mb-1 ${
              isAI ? "text-purple-700" : isSelf ? "text-primary-600" : "text-gray-700"
            }`}
          >
            {senderName}
          </span>

          {/* Pesan bubble */}
          <div
            className={`p-2 text-sm max-w-lg break-words rounded-lg shadow-sm ${
              isAI
                ? `${aiBubbleColor} rounded-br-xl`
                : isSelf
                ? "bg-primary-800 text-white rounded-l-lg rounded-tr-lg"
                : "bg-gray-200 text-gray-800 rounded-r-lg rounded-tl-lg"
            }`}
          >
            {item.message || item.content || "No content"}
          </div>

          {/* Timestamp */}
          <span
            className={`text-xs mt-1 ${
              isAI ? "text-purple-500" : isSelf ? "text-primary-400" : "text-gray-500"
            }`}
          >
            {createdAt}
          </span>
        </div>
      </div>
    </div>
  );
}
