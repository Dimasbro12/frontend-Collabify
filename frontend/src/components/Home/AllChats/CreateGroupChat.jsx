import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGroup, searchUsers } from "../../../redux/appReducer/action";
import AddUser from "../../CommonComponents/AddUser";
import Badge from "../../CommonComponents/Badge";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomInput from "../../CommonComponents/CustomInput";
import { AiOutlinePlus } from "react-icons/ai";

export default function CreateGroupChat() {
  const [isModalVisible, setModalVisibility] = useState(false);
  const [userInput, setUserInput] = useState({ groupName: "", searchUser: "", addUsers: [] });
  const searchedUser = useSelector((state) => state.appReducer.searchedUser);
  const isSearchUserProcessing = useSelector((state) => state.appReducer.isSearchUserProcessing);
  const createGroupChatSuccess = useSelector((state) => state.appReducer.createGroupChatSuccess);
  const createGroupChatFail = useSelector((state) => state.appReducer.createGroupChatFail);
  const createGroupChatProcessing = useSelector((state) => state.appReducer.createGroupChatProcessing);
  const dispatch = useDispatch();

  const toggleModal = () => {
    setModalVisibility(!isModalVisible);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addUser = (userId, name) => {
    if (!userInput.addUsers.some((user) => user.userId === userId)) {
      setUserInput((prevState) => ({
        ...prevState,
        addUsers: [...prevState.addUsers, { userId, name }],
      }));
    }
  };

  const removeUser = (userId) => {
    setUserInput((prevState) => ({
      ...prevState,
      addUsers: prevState.addUsers.filter((user) => user.userId !== userId),
    }));
  };

  const handelCreateGroup = () => {
    if (userInput.groupName.length <= 0) {
      toast.warn("Please give a group name.", { position: toast.POSITION.BOTTOM_LEFT });
      return;
    }

    if (userInput.addUsers.length < 2) {
      toast.warn("Add a minimum of two users to create a group.", { position: toast.POSITION.BOTTOM_LEFT });
      return;
    }

    const obj = {
      name: userInput.groupName,
      users: JSON.stringify(userInput.addUsers.map((user) => user.userId)),
    };

    dispatch(createGroup(obj));
  };

  useEffect(() => {
    if (createGroupChatSuccess && !createGroupChatProcessing) {
      toast.success("Group successfully created.", { position: toast.POSITION.BOTTOM_LEFT });
      setUserInput({ groupName: "", searchUser: "", addUsers: [] });
      setTimeout(() => {
        toggleModal();
      }, 1000);
    }

    if (createGroupChatFail && !createGroupChatProcessing) {
      toast.error("Failed to create group.", { position: toast.POSITION.BOTTOM_LEFT });
    }
  }, [createGroupChatSuccess, createGroupChatProcessing, createGroupChatFail]);

  useEffect(() => {
    if (userInput.searchUser.trim() !== "") {
      const debounceTimer = setTimeout(() => {
        dispatch(searchUsers(userInput.searchUser.trim()));
      }, 500);

      return () => clearTimeout(debounceTimer);
    }
  }, [userInput.searchUser, dispatch]);

  return (
    <section>
      <div className="p-[2px] rounded-lg bg-gradient-to-r from-purple-600 via-fuchsia-500 to-green-400 inline-block">
        <button
          onClick={toggleModal}
          className="flex items-center gap-2 text-white bg-primary-600/50 hover:bg-primary-700/50 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full h-full"
          type="button"
        >
          <AiOutlinePlus size={"20px"} />
          Create Group
        </button>
      </div>

      {isModalVisible && (
  <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
    <div className="bg-white border-[3px] border-black rounded-xl p-6 w-full max-w-md">
      <h2 className="text-center text-lg font-bold mb-4">Create Group</h2>
      {/* group name input */}
      <label className="block mb-3 font-bold">
        Group Name:
        <input
          type="text"
          name="groupName"
          value={userInput.groupName}
          onChange={handleInputChange}
          placeholder="Enter Group Name"
          required
          className="mt-1 w-full p-2 border-2 border-black bg-white outline-none"
          disabled={createGroupChatProcessing}
        />
      </label>
      {/* search and add user input */}
      <label className="block mb-3 font-bold">
        Add User:
        <input
          type="text"
          name="searchUser"
          value={userInput.searchUser}
          onChange={handleInputChange}
          placeholder="Enter User"
          required
          className="mt-1 w-full p-2 border-2 border-black bg-white outline-none"
          disabled={createGroupChatProcessing}
        />
      </label>
      {/* Badge status */}
      <div className="flex flex-wrap gap-2 mb-2">
        {userInput.addUsers?.map((item) => (
          <Badge label={item.name} userId={item.userId} removeUser={removeUser} key={item.userId} />
        ))}
      </div>
      {/* loading status */}
      {isSearchUserProcessing && (
        <div className="mt-5 mx-auto h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" role="status"></div>
      )}
      {/* if no user found */}
      {!isSearchUserProcessing && searchedUser.length === 0 && (
        <p className="text-gray-500 text-center mt-4">No User Found.</p>
      )}
      {/* map searched result */}
      <div className="max-h-[30vh] overflow-y-auto p-2">
        {searchedUser.length !== 0 &&
          searchedUser?.map((item) => (
            <AddUser
              addUser={addUser}
              userId={item._id}
              name={item.name}
              email={item.email}
              imageSrc={item.pic}
              key={item._id}
            />
          ))}
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={toggleModal}
          type="button"
          disabled={createGroupChatProcessing}
          className="border-2 border-black bg-white hover:bg-gray-100 text-black font-bold py-2 px-4"
        >
          Cancel
        </button>
        <button
          onClick={handelCreateGroup}
          type="button"
          disabled={createGroupChatProcessing}
          className="border-2 border-black bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-2 px-4"
        >
          {createGroupChatProcessing ? (
            <span className="flex items-center">
              <span className="mr-2">Please wait</span>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
            </span>
          ) : (
            "Create Group"
          )}
        </button>
      </div>
    </div>
    <ToastContainer />
  </div>
)}

      <ToastContainer />
    </section>
  );
}
