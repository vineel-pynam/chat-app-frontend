"use client";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuthStore }  from "../zustand/useAuthStore.js";
import axios from "axios";
import { useUsersStore } from "../zustand/useUsersStore.js";
import ChatUsers from "../_components/chatUsers.jsx";
import { useChatReceiverStore } from "../zustand/useChatReceiverStore.js";
import { useChatMsgsStore } from "../zustand/useChatMsgsStore.js";

const Chat = () => {
  const [msg, setMsg] = useState("");
  const [socket, setSocket] = useState(null);
  // const [messages, setMessages] = useState([]);
  const {authName} = useAuthStore();
  const {updateUsers} = useUsersStore();
  const {chatReceiver} = useChatReceiverStore();
  const { chatMsgs, updateChatMsgs } = useChatMsgsStore();

  const getUserData = async () => {
    const res = await axios.get("http://localhost:4000/users", {
      withCredentials: true,
    }); 
    updateUsers(res.data);
    console.log("User data: ", res.data);
};

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      query: { username: authName },
    });
    setSocket(newSocket);

    newSocket.on("chat message", (msg) => {
      console.log("received message on client: ", msg);
      updateChatMsgs([...chatMsgs, msg]);
      // setMessages((oldMsgs) => [
      //   ...oldMsgs,
      //   { text: msg, sentByCurrUser: false },
      // ]);
    });

    getUserData();

    return () => newSocket.close();
  }, []);

  function sendMsg(e) {
    e.preventDefault();
    const msgToSend = {
      message: msg,
      sender: authName,
      receiver: chatReceiver,
    }
    if (socket) {
      socket.emit("chat message", msgToSend);
      updateChatMsgs([...chatMsgs, msgToSend]);
      // setMessages((oldMsgs) => [
      //   ...oldMsgs,
      //   { text: msg, sentByCurrUser: true },
      // ]);
      setMsg("");
    }
  }

  return (
    <div className="h-screen flex divide-x-4">
      <div className="w-1/5 flex bg-blue-500">
        <ChatUsers />
      </div>
  
      <div className="w-4/5 flex flex-col bg-red-500">
        <div className="h-1/5">
          <h1>
            {authName} is chatting with {chatReceiver}
          </h1>
        </div>
        <div className="msgs-container">
          {
          console.log("chat: ", chatMsgs)
          }
          {
          chatMsgs.map((msg, index) => (
            <div
              key={index}
              className={`msg ${
                msg.sender == authName ? "text-right" : "text-left"
              } m-5`}
            >
              {msg.message}
            </div>
          ))}
        </div>
        <div className="h-1/5 flex items-center justify-center">
          <form onSubmit={sendMsg} class="w-1/2">
            <div class="relative">
              <input
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type your text here"
                required
                class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <button
                type="submit"
                class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
