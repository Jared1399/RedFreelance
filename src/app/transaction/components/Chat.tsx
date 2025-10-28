"use client";
import { useEffect, useState, useContext, useCallback } from "react";
import Message from "./Message";
import { useSession } from "next-auth/react";
import { TransactionContext } from "../hooks/UseTransaction/context";
import ConfirmationModal from "./ConfirmationModal";
import InfoBanner from "./InfoBanner";
import AddMedia from "./AddMedia";
import { useChat } from "../hooks/useChat";
import DeliveryModal from "./DeliveryModal";
import { LocalMsg } from "../types/Chat";
import formatDateES from '@/lib/timeago';


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
    uploadingFile
  } = useChat(currTransaction, session?.userId);


  const isFreelancer = session?.userId == currTransaction?.freelancerId;

  const disabledChat = !!currTransaction?.disabledChat;

  const date = state.currentTransaction?.expirationDate;
  const formattedDate = date ? formatDateES(date.toString()) : '';

  const isAvailableBanner = currTransaction?.lifecycle?.name === 'completed' ?
    "Este trabajo ha sido completado exitosamente" :
    disabledChat ?
      "Esta conversación ya no está disponible"
      :
      `Esta conversación está disponible hasta dentro de ${formattedDate}`;

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const acceptTransaction = currTransaction?.lifecycle?.name == 'requested' &&
    <ConfirmationModal
      label="Comenzar con este trabajo?"
      options={{ accept: "payment_pending", deny: "rejected_on_request" }}
    />;

  const acceptDelivery = currTransaction?.lifecycle?.name == 'on_review' &&
    <ConfirmationModal
      label="La entrega ha sido realizada, aceptar y finalizar trabajo?"
      options={{ accept: "completed", deny: "disputed" }}
    />;


  const messageList = messages.map((msg, idx) => (
    <Message key={msg.id ?? idx} msg={msg as LocalMsg} />
  ));

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messagesContainerRef]);

  const send = useCallback(async () => {
    await sendMessage(input, selectedFile, { type: selectedFile ? "multimedia" : "text" });
    setInput("");
    if (selectedFile) setSelectedFile(null);

  }, [input, selectedFile, sendMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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
            <InfoBanner content={isAvailableBanner} icon="🛈" />
          </div>

          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-2"
            style={{ maxHeight: "100%" }}
          >
            {messageList}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center p-4 bg-neutral-300 border-t rounded-b-lg relative">

            {isFreelancer && acceptTransaction}
            {!disabledChat && (isFreelancer && <DeliveryModal />)}
            {!isFreelancer && acceptDelivery}

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
                disabled:border-neutral-400
                `}
              placeholder={
                `${disabledChat ?
                  "Este chat ya no esta disponible" :
                  "Escribe un mensaje..."
                }`
              }
              value={input}
              disabled={disabledChat || uploadingFile}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), send())}
            />

            {!disabledChat && <AddMedia onFileChange={handleFileChange} reset={resetFile} />}

            <button
              onClick={() => send()}
              className={
                `
                bg-amber-700 
                text-white 
                px-4 
                py-2 
                rounded-lg 
                hover:bg-amber-900
              disabled:bg-neutral-400 
                disabled:cursor-not-allowed
              disabled:text-gray-100
                ` }
              disabled={uploadingFile || disabledChat}
            >
              {uploadingFile ? "..." : "Enviar"}
            </button>
          </div>
        </div>
      ) : (
        <div>Selecciona o crea una transaccion para continuar</div>
      )}
    </>
  );
}

