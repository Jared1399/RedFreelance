"use client";
import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";
import Message from "./Message";
import { TransactionInterface } from "../types/Transaction";
import transactionService from "../transaction.service";
import { ConversationInterface, MessageInterface } from "../types/Chat";
import { useSession } from "next-auth/react";


export default function Chat({ currentGig }: { currentGig: TransactionInterface }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([
    {
      text: currentGig.requestDetails,
      sender: currentGig.clientId == session?.userId ? "me" : "other"
    }
  ]);
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState<ConversationInterface>();

  const socketRef = useRef<Socket>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:4000");

    socketRef.current.on("message", (msg: { text: string; sender: string }) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const { conversation } = await transactionService
          .getConversationByTransactionId(currentGig.id);

        if (!conversation) {
          const createConversation = await transactionService.createConversation(
            currentGig.clientId,
            currentGig.freelancerId,
            currentGig.id
          );
          const res = await createConversation.json();

          if (res.ok) {
            const { conversation } = await transactionService
              .getConversationByTransactionId(currentGig.id);
            setConversation(conversation);
          }
        }

        if (conversation) {
          const msgList = conversation.messages.map((msg: MessageInterface) => ({
            text: msg.text,
            sender: msg.senderId === session?.userId ? "me" : "other"
          }));
          setConversation(conversation);
          setMessages((prev) => [...prev, ...msgList]);
        }

      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    fetchConversation();
  }, [currentGig.id, currentGig.clientId, currentGig.freelancerId, session?.userId]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg = {
      text: input,
      senderId: session?.userId,
    };


    transactionService.sendMessage(
      session?.userId ?? "",
      conversation?.id ?? "",
      newMsg.text
    );

    socketRef.current?.emit("message", newMsg);
    setMessages((prev) => [...prev, { ...newMsg, sender: "me" }]);

    setInput("");
  };

  return (
    <div
      className="flex 
      flex-col 
      h-screen 
      bg-gray-100 
      mx-2 
      dark:bg-card 
      dark:border 
      rounded-lg
      "
    >
      <div className="bg-accent text-white font-bold  p-4">
        {`${currentGig.gig.title} - ${currentGig.tier.name} `}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => <Message key={idx} msg={msg} />)}
      </div>
      <div className="flex items-center p-4 bg-neutral-300 border-t rounded-b-lg ">
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
