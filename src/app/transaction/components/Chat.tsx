"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import Message from "./Message";
import { TransactionInterface } from "../types/Transaction";
import transactionService from "../transaction.service";
import { ConversationInterface, MessageInterface } from "../types/Chat";


const socket = io("http://localhost:4000");

export default function Chat({ currentGig }: { currentGig: TransactionInterface }) {
  const [messages, setMessages] = useState<{ text: string; sender: "me" | "other" }[]>([
    { text: currentGig.requestDetails, sender: "other" }
  ]);
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState<ConversationInterface>();

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const { conversation } = await transactionService
          .getConversationByTransactionId(currentGig.id);

        if (!conversation) {
          await transactionService.createConversation(
            currentGig.clientId,
            currentGig.freelancerId,
            currentGig.id
          );
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    fetchConversation();
  }, [conversation]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { conversation } = await transactionService
        .getConversationByTransactionId(currentGig.id);

      const msgList = conversation.messages.map((msg: MessageInterface) => {
        return {
          ...msg,
          sender: msg.senderId == currentGig.freelancerId ? 'me' : 'other'
        };
      });

      setConversation(conversation);
      setMessages(conversation ?
        [...messages, msgList].flat() :
        messages
      );
    };

    fetchMessages();

  }, [currentGig.freelancerId]);

  useEffect(() => {
    const handleMessage = (msg: string) => {
      setMessages((prev) => [...prev, { text: msg, sender: "other" }]);
    };

    return () => {
      socket.off("message", handleMessage);
    };
  }, []);


  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: { text: string; sender: "me" | "other" } = {
      text: input,
      sender: "me"
    };

    if (!conversation?.id) {
      console.warn("No conversation yet, cannot send message");
      return;
    }

    const sendMessage = async () => {

      await transactionService.sendMessage(
        currentGig.freelancerId,
        conversation?.id,
        newMsg.text
      );
    };

    sendMessage();
    setMessages((prev) => [...prev, newMsg]);
    socket.emit("message", input);
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
