"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import Message from "./Message";
import { TransactionInterface } from "../types/Transaction";

const socket = io("http://localhost:4000");


export default function Chat({ currentGig }: { currentGig: TransactionInterface }) {
  const [messages, setMessages] = useState<{ text: string; sender: "me" | "other" }[]>([
    { text: currentGig.requestDetails, sender: "other" }
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, { text: msg, sender: "other" }]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: { text: string; sender: "me" | "other" } = {
      text: input,
      sender: "me"
    };
    setMessages((prev) => [...prev, newMsg]);
    socket.emit("message", input);
    setInput("");
  };


  return (
    <div className="flex flex-col h-screen bg-gray-100 mx-2 dark:bg-card dark:border rounded-lg">
      <div className="bg-accent text-white font-bold  p-4">
        {`${currentGig.gig.title} - ${currentGig.tier.name} `}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => <Message key={idx} msg={msg} />)}
      </div>
      <div className="flex items-center p-4 bg-neutral-300 border-t rounded-b-lg">
        <input
          type="text"
          className="
            flex-1 
            border 
            borderbg-neutral-700 
            rounded-lg 
            px-4 
            py-2 
            mr-2 
            focus:outline-none 
            text-black
          "
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
