import React, { useEffect } from 'react'
import { useUsersStore } from '../zustand/useUsersStore'
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';
import axios from 'axios';  
import { useChatMsgsStore } from '../zustand/useChatMsgsStore';
import { useAuthStore } from '../zustand/useAuthStore';

const ChatUsers = () => {
  const {users} = useUsersStore();
  const { chatReceiver, updateChatReceiver} = useChatReceiverStore();
  const { authName } = useAuthStore();
  const { updateChatMsgs } = useChatMsgsStore();

  const setChatReceiver = (user) => {
    updateChatReceiver(user.username);
  }

  useEffect(() => {
    const getMessages = async () => {
      const response = await axios.get(`http://localhost:3000/msgs`, {
        params: {
          sender: authName,
          receiver: chatReceiver
        }
      }, {
        withCredentials: true
      });

      if ( response.data.length > 0 ) {
        console.log("Messages: ", response.data);
        updateChatMsgs(response.data);
      }else {
        updateChatMsgs([]);
      }
    }

    if( chatReceiver ){
      getMessages();
    }

  }, [chatReceiver]);

  return (
    <div>
      {
        users.map((user, index) => (
          <div key={index} onClick={ () => setChatReceiver(user)} className='bg-slate-400 rounded-xl m-3 p-5'>
            <p>{user.username}</p>
          </div>
        ))
      }
    </div>
  )
}

export default ChatUsers