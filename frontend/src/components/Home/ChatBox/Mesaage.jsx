export default function Message({ item }) {
  const parsedData = JSON.parse(localStorage.getItem("chat-app-login-user-data")) || {};
  const isAI = item.isAi === true;
  const isAIForSelf = isAI && (
  typeof item.receiver === "object"
    ? item.receiver._id === parsedData._id
    : item.receiver === parsedData._id
);

  const isSelf =
  !isAI &&
  parsedData?._id &&
  (
    typeof item.sender === "object"
      ? item.sender?._id === parsedData._id
      : item.sender === parsedData._id
  );

  const createdAt = new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  let aiBubbleColor = "bg-white text-purple-900 border border-purple-400";
  if (isAIForSelf) {
  const colorMap = ["bg-blue-100 text-blue-800", "bg-green-100 text-green-800", "bg-pink-100 text-pink-800"];
  const idx = parsedData._id.charCodeAt(parsedData._id.length - 1) % colorMap.length;
  aiBubbleColor = colorMap[idx];
  }

  const avatarSrc = isAI
  ? "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
  : item.sender && typeof item.sender === "object" && item.sender.pic
  ? item.sender.pic
  : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <div className={`flex flex-col ${isSelf ? "items-end" : "items-start"} m-3`}>
      <div className={`flex gap-2 mb-1 ${isSelf ? "flex-row-reverse" : ""}`}>
        <div className={`${isSelf ? "text-right" : "text-left"}`}>
          <div
            className={`p-2 text-sm max-w-lg break-words rounded-lg ${
              isAI
                ? `${aiBubbleColor} shadow-sm rounded-br-xl`
                : isSelf
                ? "bg-primary-800 text-primary-50 rounded-l-lg rounded-tr-lg"
                : "bg-gray-200 text-gray-800 rounded-r-lg rounded-tl-lg"
            }`}
          >
            {isAI && <span className="text-xs font-semibold text-purple-600 block mb-1">AI Chatbot</span>}
            {item.message || item.content || "No content"}
          </div>

          <span className={`text-xs ${isAI ? "text-purple-500" : "text-primary-50"} px-1`}>{createdAt}</span>
        </div>
        <div className="bg-primary-50 rounded-full w-9 h-9 flex items-center justify-center">
          <img alt="Avatar" src={avatarSrc} className="w-8 h-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
