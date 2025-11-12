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
  const { state, actions } = useContext(TransactionContext);

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
    uploadingFile,
  } = useChat(currTransaction, session?.userId);

  const send = useCallback(async () => {
    await sendMessage(input, selectedFile, { type: selectedFile ? "multimedia" : "text" });
    setInput("");
    if (selectedFile) setSelectedFile(null);

  }, [input, selectedFile, sendMessage]);

  useEffect(() => {
    const handleGlobalMessage = async () => {
      actions.handleDeliveryLocal();
    };

    window.document.addEventListener('newDelivery', handleGlobalMessage);

    return () => {
      window.document.removeEventListener('newDelivery', handleGlobalMessage);
    };
  }, [currTransaction]);

  useEffect(() => {
    if (messages.length === 0) return;

    const forceScroll = () => {
      const container = messagesContainerRef.current;
      if (!container) return;

      container.scrollTop = container.scrollHeight;

      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
        });
      });
    };

    forceScroll();
    const timers = [100, 200, 500].map(delay =>
      setTimeout(forceScroll, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [messages]);

  if (!currTransaction) return;

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

  const deliveryAllowed = ['payment_approved', 'disputed', 'on_review', 'delivered'];

  const showDeliveryModal = deliveryAllowed.includes(currTransaction?.lifecycle?.name) &&
    !disabledChat &&
    (isFreelancer && <DeliveryModal />);

  const messageList = messages.map((msg, idx) => (
    <Message key={msg.id ?? idx} msg={msg as LocalMsg} />
  ));

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  return (
    <>
      {currTransaction ? (
        <div
          className="
        flex 
        flex-col 
        h-dvh 
        md:h-screen
        bg-background
        text-foreground
        mx-0 
        border
        border-border
        rounded-none md:rounded-lg 
        overflow-x-hidden
        w-full
      "
        >
          <div className="bg-accent text-accent-foreground font-bold p-3 md:p-4 relative">
            <div className="text-sm md:text-base truncate">
              {`${currTransaction?.gig?.title} - ${currTransaction?.tier?.name}`}
            </div>
            <InfoBanner content={isAvailableBanner} icon="🛈" />
          </div>

          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 bg-background"
            style={{ maxHeight: '100%' }}
          >
            {messageList}
            <div ref={messagesEndRef} />
          </div>

          <div
            className="
              flex 
              items-center 
              p-3 
              md:p-4 
              bg-accent/20 
              border-t 
              border-border 
              rounded-b-lg 
              gap-2
            ">
            {isFreelancer && acceptTransaction}
            {!isFreelancer && acceptDelivery}

            <div className="flex flex-col md:flex-row gap-1 md:gap-2 flex-shrink-0">
              {showDeliveryModal}
              {!disabledChat && (
                <AddMedia onFileChange={handleFileChange} reset={resetFile} />
              )}
            </div>

            <input
              type="text"
              className={`
                flex-1 
                border 
                border-border
                bg-background
                text-foreground
                rounded-lg 
                px-3 md:px-4 
                py-2 
                text-sm md:text-base
                focus:outline-none 
                focus:ring-2 
                focus:ring-accent/40
                disabled:border-muted-foreground/40
                disabled:bg-muted/60
                disabled:text-muted-foreground
                min-w-0
                h-full
                min-h-[44px]
              `}
              placeholder={
                `${disabledChat
                  ? 'Este chat ya no está disponible'
                  : 'Escribe un mensaje...'
                }`
              }
              value={input}
              disabled={disabledChat || uploadingFile}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), send())}
            />

            <button
              onClick={() => send()}
              className={`
            bg-accent
            text-accent-foreground
            px-3 md:px-4 
            py-2 
            rounded-lg
            h-full 
            hover:bg-amber-700
            disabled:bg-muted 
            disabled:cursor-not-allowed
            disabled:text-muted-foreground
            text-sm md:text-base
            whitespace-nowrap
            flex-shrink-0
            transition-colors
          `}
              disabled={uploadingFile || disabledChat}
            >
              {uploadingFile ? '...' : 'Enviar'}
            </button>
          </div>
        </div>
      ) : (
        <div
          className="p-4 text-center text-foreground bg-background border border-border rounded-lg"
        >
          Selecciona o crea una transacción para continuar
        </div>
      )}
    </>

  );
}

