import React from 'react';

interface Message {
  sender: string;
  text: string
}

export default function Message({ msg }: { msg: Message }) {
  return (
    <div className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 
          py-2 
          rounded-lg 
          max-w-xs 
          ${msg.sender === "me" ? "bg-amber-700 text-white" : "bg-gray-300 text-black"}
          `}
      >
        {msg.text}
      </div>
    </div >
  );
}