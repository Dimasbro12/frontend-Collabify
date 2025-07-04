import React, { useEffect, useState } from 'react';
import { BsInfoCircle } from 'react-icons/bs';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { exitGroup, resetSelectedUserForChat } from '../../../redux/appReducer/action';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

export default function ChatDetails() {
  const selectedUserForChat = useSelector((state) => state.appReducer.selectedUserForChat);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleExitGroup = async () =>{
    try{
      dispatch(exitGroup({ chatId: selectedUserForChat._id }));
      toast.success("You have exited the group successfully.", { position: toast.POSITION.BOTTOM_LEFT });
      dispatch(resetSelectedUserForChat())
      toggleModal();
      navigate('/');
    }catch (error) {
      console.error("Error exiting group:", error);
      toast.error("Failed to exit the group.", { position: toast.POSITION.BOTTOM_LEFT });
    }
  }

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // find group admin
  const groupAdmin = () => {
    const admin = selectedUserForChat.users.find(user => user._id === selectedUserForChat.groupAdmin);
    return admin.name
  }


  return (
    <section>
      <button className="bg-primary-800 text-white p-2 rounded-full hover:bg-primary-700 focus:outline-none" onClick={toggleModal}>
        <BsInfoCircle size={24} />
      </button>

      {showModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm">
          <div className="bg-primary-50 text-primary-800 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">{selectedUserForChat.chatName}</h2>
              <button className="hover:text-primary-500 text-primary-800 rounded-md py-1 px-2" onClick={toggleModal}>
                <AiOutlineCloseCircle size={'25px'} />
              </button>
            </div>

            {/* total members */}
            <p className="text-md font-semibold text-primary-800 truncate mt-4"> Group Admin - <span className='font-normal'> {groupAdmin()} </span></p>
            <p className="text-md font-semibold text-primary-800 truncate mt-1"> Total Members - <span className='font-normal'> {selectedUserForChat.users.length}  </span> </p>
            <p className="text-md font-semibold text-primary-800 truncate mt-1"> Group ID - <span className='font-normal'> {selectedUserForChat._id} </span> </p>

            {/* group members */}
            <div className='max-h-[50vh] min-w-[20vw] overflow-y-auto p-2'>
              {selectedUserForChat.users?.map((item) => (
                <div key={item.id} className=" bg-primary-200 flex items-center space-x-4 p-2 shadow-lg rounded-lg mt-4">
                  <div className={`bg-primary-50 rounded-full w-11 h-11 flex items-center justify-center`}>
                    <img className="w-10 h-10 rounded-full" src={item.pic} alt={`${item.name} image`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-md font-semibold text-primary-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs font-semibold text-primary-400 truncate">
                      {item.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* tampilkan tombol exit hapus grup  disini*/}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleExitGroup}
                className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-md"
              >
                Exit Group
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
