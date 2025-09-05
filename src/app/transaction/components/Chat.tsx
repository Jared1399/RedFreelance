"use client";
import { useEffect, useState, useRef, useContext } from "react";
import io, { Socket } from "socket.io-client";
import Message from "./Message";
import transactionService from "../transaction.service";
import { ConversationInterface, MessageInterface } from "../types/Chat";
import { useSession } from "next-auth/react";
import { TransactionContext } from "../hooks/UseTransaction/context";


export default function Chat() {
  const { data: session } = useSession();
  const { state } = useContext(TransactionContext);

  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState<ConversationInterface>();

  const socketRef = useRef<Socket>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (!messagesContainerRef.current || !messagesEndRef.current) return;
    messagesContainerRef.current.scrollTop = messagesEndRef.current.offsetTop;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



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
        if (!state.currentTransaction) return;

        setMessages([{
          text: state.currentTransaction.requestDetails,
          sender: state.currentTransaction.clientId == session?.userId ? "me" : "other"
        }]);

        const { conversation } = await transactionService
          .getConversationByTransactionId(state.currentTransaction.id);

        if (!conversation) {
          const createConversation = await transactionService.createConversation(
            state.currentTransaction.clientId,
            state.currentTransaction.freelancerId,
            state.currentTransaction.id
          );
          const res = await createConversation.json();

          if (res.ok) {
            const { conversation } = await transactionService
              .getConversationByTransactionId(state.currentTransaction.id);
            setConversation(conversation);
          }
        }

        if (!conversation) return;
        const firstMessage = {
          text: state.currentTransaction.requestDetails,
          sender: state.currentTransaction.clientId == session?.userId ? "me" : "other"
        };

        const msgList = conversation.messages.map((msg: MessageInterface) => ({
          text: msg.text,
          sender: msg.senderId === session?.userId ? "me" : "other"
        }));
        setConversation(conversation);
        setMessages([firstMessage, msgList].flat());

      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    fetchConversation();
  }, [state.currentTransaction]);

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
    <>
      {state.currentTransaction ? (
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
            {`${state.currentTransaction?.gig?.title} - ${state.currentTransaction?.tier?.name} `}
          </div>
          <div
            className="flex-1 overflow-y-auto p-4 space-y-2"
            style={{ maxHeight: "100%", scrollBehavior: "smooth" }}
            ref={messagesContainerRef}
          >
            {messages.map((msg, idx) => <Message key={idx} msg={msg} />)}
            <div ref={messagesEndRef} />
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
      ) : (
        <div>Selecciona o crea una transaccion para continuar</div>

      )}
    </>
  );
}

