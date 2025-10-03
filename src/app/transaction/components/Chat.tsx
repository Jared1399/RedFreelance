"use client";
import { useEffect, useState, useContext, useCallback } from "react";
import Message from "./Message";
import { useSession } from "next-auth/react";
import { TransactionContext } from "../hooks/UseTransaction/context";
import ConfirmationModal from "./ConfirmationModal";
import TimeOutBanner from "./TimeOutBanner";
import AddMedia from "./AddMedia";
import { useChat } from "../hooks/useChat";


export default function Chat() {
  const { data: session } = useSession();
  const { state } = useContext(TransactionContext);

  const [input, setInput] = useState("");

  const currTransaction = state.currentTransaction;

  const {
    messages,
    selectedFile,
    setSelectedFile,
    resetFile,
    sendMessage,
    messagesContainerRef,
    messagesEndRef,
  } = useChat(currTransaction, session?.userId);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messagesContainerRef]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);


  const send = useCallback(async () => {
    await sendMessage(input, selectedFile);
    setInput("");
  }, [input, selectedFile, sendMessage]);

  const confirmationModal = currTransaction?.lifecycleId == 1 &&
    <ConfirmationModal />;

  const disabledChat = currTransaction?.disabledChat ?? false;

  return (
    <>
      {currTransaction ? (
        <div
          className="
            flex 
            flex-col 
            h-screen 
            bg-gray-100 
            mx-2 
            dark:bg-card 
            dark:border 
            rounded-lg 
            overflow-x-hidden
          "
        >
          <div className="bg-accent text-white font-bold p-4 relative">
            {`${currTransaction?.gig?.title} - ${currTransaction?.tier?.name}`}
            <TimeOutBanner />
          </div>
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-2"
            style={{ maxHeight: "100%" }}
          >
            {messages.map((msg, idx) => (
              <Message key={idx} msg={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center p-4 bg-neutral-300 border-t rounded-b-lg relative">
            {confirmationModal}
            <input
              type="text"
              className={`
                flex-1 
                border 
                rounded-lg 
                px-4 
                py-2 
                mr-2 
                focus:outline-none 
                text-black
                ${disabledChat ? "border-red-800 border-4" : ""}
                `}
              placeholder={
                `${disabledChat ?
                  "Este chat ya no esta disponible" :
                  "Escribe un mensaje..."
                }`
              }
              value={input}
              disabled={disabledChat}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), send())}
            />
            <AddMedia onFileChange={handleFileChange} reset={resetFile} />
            <button
              onClick={() => send()}
              className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-900"
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

