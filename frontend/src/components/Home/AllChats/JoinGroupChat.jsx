import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { joinGroup, selectUserForChat, getChats } from "../../../redux/appReducer/action";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { AiOutlineUserAdd } from "react-icons/ai";

export default function JoinGroupChat() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalVisible, setModalVisible] = useState(false);
  const [chatId, setChatId] = useState("");

  const { loading, error, success } = useSelector((state) => state.joinGroup || {});

  const toggleModal = () => setModalVisible((prev) => !prev);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chatId.trim()) {
      toast.warn("Please enter a Group ID.", { position: toast.POSITION.BOTTOM_LEFT });
      return;
    }
    dispatch(joinGroup( chatId ));
  };

  useEffect(() => {
    if (success && !loading) {
      toast.success("Successfully joined the group!", { position: toast.POSITION.BOTTOM_LEFT });
      const joinedChat = success.chat || success.data; // tergantung response backend
      if (joinedChat) {
        dispatch(selectUserForChat(joinedChat));
        dispatch(getChats());
        setChatId("");
        setModalVisible(false);
        navigate("/ChatBox");
      }
    }
    if (error && !loading) {
      toast.error(error || "Failed to join group.", { position: toast.POSITION.BOTTOM_LEFT });
    }
    // eslint-disable-next-line
  }, [success, error, loading]);

  return (
    <section>
      <div className="p-[2px] rounded-lg bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 inline-block">
        <button
          onClick={toggleModal}
          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full h-full"
          type="button"
        >
          <AiOutlineUserAdd size={"20px"} />
          Join
        </button>
      </div>

      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
          <div className="bg-[#fdf6e3] border-[3px] border-black rounded-xl p-6 w-full max-w-md font-mono">
            <h2 className="text-center text-lg font-bold mb-4">Join Group Chat</h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-3 font-bold">
                Group ID:
                <input
                  type="text"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  required
                  className="mt-1 w-full p-2 border-2 border-black bg-white outline-none"
                  disabled={loading}
                />
              </label>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="border-2 border-black bg-white hover:bg-gray-100 text-black font-bold py-2 px-4"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="border-2 border-black bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-2 px-4"
                  disabled={loading}
                >
                  {loading ? "Joining..." : "Gas Join"}
                </button>
              </div>
            </form>
          </div>
          <ToastContainer />
        </div>
      )}
    </section>
  );
}