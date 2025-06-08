import React, { useState } from "react";
import JoinGroupModal from "./JoinGroupChat"; // path sesuai struktur project
import { AiOutlineUserAdd } from "react-icons/ai";

const JoinGroupButton = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!isModalOpen);

  return (
    <>
      <button
        onClick={toggleModal}
        className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
      >
        <AiOutlineUserAdd />
        Join 
      </button>

      <JoinGroupModal isVisible={isModalOpen} toggleModal={toggleModal} />
    </>
  );
};

export { JoinGroupButton };
