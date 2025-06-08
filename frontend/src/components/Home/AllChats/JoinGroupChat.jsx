import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { joinGroup, selectUserForChat, getChats } from "../../../redux/appReducer/action";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const JoinGroupModal = ({ isVisible, toggleModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [chatId, setChatId] = useState("");

  const { loading, error, success } = useSelector((state) => state.joinGroup || {});

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!chatId.trim()) {
      toast.warn("Please enter a Group ID.", { position: toast.POSITION.BOTTOM_LEFT });
      return;
    }

    dispatch(joinGroup(chatId));
  };

  useEffect(() => {
    if (success && !loading) {
      toast.success("Successfully joined the group!", { position: toast.POSITION.BOTTOM_LEFT });

      const joinedChat = success.data;
       if (joinedChat) {
       // setRedux selected chat
        dispatch(selectUserForChat(joinedChat));
        // update daftar chat
        dispatch(getChats());
        // close modal
        toggleModal();
        // redirect ke chatbox
        navigate("/ChatBox");
        // reset input
        setChatId("");
    }

      // toggleModal();
      setTimeout(() => toggleModal(), 1000);
    }

    if (error && !loading) {
      toast.error(error || "Failed to join group.", { position: toast.POSITION.BOTTOM_LEFT });
    }
  }, [success, error, loading]);

  if (!isVisible) return null;

  return (
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
            />
          </label>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={toggleModal}
              className="border-2 border-black bg-white hover:bg-gray-100 text-black font-bold py-2 px-4"
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
  );
};

export default JoinGroupModal;
