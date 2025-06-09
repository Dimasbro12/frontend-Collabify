import React, { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import UserCard from "./UserCard";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers } from "../redux/appReducer/action";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const searchedUser = useSelector((state) => state.appReducer.searchedUser);
  const isSearchUserProcessing = useSelector((state) => state.appReducer.isSearchUserProcessing);
  const singleUserChatsuccess = useSelector((state) => state.appReducer.singleUserChatsuccess);

  const dispatch = useDispatch();

  useEffect(() => {
    if (singleUserChatsuccess) {
      setIsOpen(false);
    }
  }, [singleUserChatsuccess]);

  const handleOpenSidebar = () => {
    setIsOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsOpen(false);
  };

  const handelSearchUser = () => {
    dispatch(searchUsers(userInput.trim()));
  };

  return (
    <>
      {/* display slider button */}
      <button className="bg-blue-350 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none" onClick={handleOpenSidebar}>
        <BiSearchAlt className="w-6 h-6" />
      </button>

      {/* sidebar */}
      <aside className={`bg-gradient-to-b from-purple-600 via-fuchsia-500 to-green-400/80 border-r-4 border-black dark:border-gray-700 text-black dark:text-white w-80 fixed top-0 ${isOpen ? "left-0" : "-left-80"} h-screen transform transition-transform duration-300 px-2 ease-in-out z-40 rounded-r-xl shadow-lg`}>
  <div className="p-5 flex justify-end">
    <button className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20 focus:outline-none z-50" onClick={handleCloseSidebar}>
      <AiOutlineCloseCircle className="w-6 h-6" />
    </button>
  </div>

  <nav className="flex flex-col flex-grow p-2">
    {/* search field */}
    <div className="relative mb-4">
      <input
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Search User"
        className="bg-white/90 dark:bg-gray-900/80 border-2 border-black dark:border-gray-600 text-gray-900 dark:text-white sm:text-sm rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 block w-full p-2.5 pr-10 placeholder-gray-500 dark:placeholder-gray-300"
      />
      <button
        className="absolute rounded-l-none rounded-r-lg inset-y-0 right-0 px-2.5 py-2.5 bg-yellow-300 hover:bg-yellow-400 border-2 border-black dark:border-gray-600 text-black dark:text-gray-900 font-bold transition"
        onClick={handelSearchUser}
        type="button"
      >
        <BiSearchAlt className="w-6 h-6" />
      </button>
    </div>

    {/* loading status */}
    {isSearchUserProcessing && <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto mt-10"></div>}

    {/* if no user found */}
    {!isSearchUserProcessing && searchedUser.length === 0 && <p className="text-gray-700 dark:text-gray-300 text-center mt-4">No User Found.</p>}

    {/* map searched result */}
    <div className="mt-7 max-h-[75vh] p-2 overflow-y-auto">
      {searchedUser.length !== 0 &&
        searchedUser.map((item) => (
          <UserCard
            key={item._id}
            userId={item._id}
            name={item.name}
            email={item.email}
            imageSrc={item.pic}
          />
        ))}
    </div>
  </nav>
</aside>
    </>
  );
}
