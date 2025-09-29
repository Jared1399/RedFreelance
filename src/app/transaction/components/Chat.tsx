"use client";
import { useEffect, useState, useRef, useContext, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import Message from "./Message";
import transactionService from "../transaction.service";
import { ConversationInterface, MessageInterface, LocalMsg } from "../types/Chat";
import { useSession } from "next-auth/react";
import { TransactionContext } from "../hooks/UseTransaction/context";
import ConfirmationModal from "./ConfirmationModal";
import TimeOutBanner from "./TimeOutBanner";
import AddMedia from "./AddMedia";


const disableChatInput = (lifecycle: { name: string }) => {
  const disabledStates = [
    "cancelled_by_client",
    "cancelled_by_freelancer",
    "rejected_on_request",
    "transaction_timeout",
    "payment_failed",
    "completed",
    ""
  ];

  if (!lifecycle) return;

  return disabledStates.some((state) => state == lifecycle.name);
};

export default function Chat() {
  const { data: session } = useSession();
  const { state } = useContext(TransactionContext);

  const [messages, setMessages] = useState<LocalMsg[]>([]);
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState<ConversationInterface | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resetFile, setResetFile] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currTransaction = state.currentTransaction;

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (!url) return;

    socketRef.current = io(url);

    const handleMessage = (msg: { text: string; senderId?: string }) => {
      const sender: LocalMsg["sender"] = msg.senderId === session?.userId ? "me" : "other";
      setMessages((prev) => [...prev, { text: msg.text, sender }]);
    };

    socketRef.current.on("message", handleMessage);

    return () => {
      socketRef.current?.off("message", handleMessage);
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [session?.userId]);

  useEffect(() => {
    let mounted = true;

    const fetchConversation = async () => {
      try {
        const transactionRef = currTransaction;
        if (!transactionRef) return;

        const initialMsg: LocalMsg = {
          text: transactionRef.requestDetails || "",
          sender: transactionRef.clientId === session?.userId ? "me" : "other",
        };

        setMessages([initialMsg]);

        const convRes = await transactionService.getConversationByTransactionId(transactionRef.id);

        const conv = convRes?.conversation ?? convRes ?? null;

        if (!conv) {
          const body = await transactionService.createConversation(
            transactionRef.clientId,
            transactionRef.freelancerId,
            transactionRef.id
          );

          if (body?.ok) {
            const newConvRes = await transactionService
              .getConversationByTransactionId(transactionRef.id);

            const newConv = newConvRes?.conversation ?? newConvRes ?? null;
            if (mounted) setConversation(newConv ?? null);
          }

          return;
        }

        const loaded: LocalMsg[] = conv.messages.map((m: MessageInterface) => ({
          text: m.text,
          sender: m.senderId === session?.userId ? "me" : "other",
          metadata: m.metadata
        }));

        if (mounted) {
          setConversation(conv);
          setMessages([initialMsg, ...loaded]);
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    fetchConversation();

    return () => {
      mounted = false;
    };
  }, [currTransaction, session?.userId]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() && !selectedFile) return;

    try {
      const newMsgs: LocalMsg[] = [];

      if (selectedFile && session?.userId && currTransaction?.id && conversation) {
        const { ok, message } = await transactionService.sendAttachment(
          selectedFile,
          session.userId,
          conversation?.id
        );
        if (ok && message) {
          newMsgs.push({ ...message, sender: "me" });
        }
        setSelectedFile(null);
        setResetFile(!resetFile);
      }

      if (input.trim() && session?.userId && conversation?.id) {
        const text = input.trim();
        await transactionService.sendMessage(session.userId, conversation.id, text);
        newMsgs.push({ text, sender: "me" });
      }

      if (newMsgs.length > 0) {
        setMessages(prev => [...prev, ...newMsgs]);
        newMsgs.forEach(msg =>
          socketRef.current?.emit("message", { ...msg, senderId: session!.userId })
        );
      }

      setInput("");
    } catch (err) {
      console.error("Error sending message or attachment", err);
    }
  }, [input, conversation, session?.userId, selectedFile]);

  const confirmationModal = currTransaction?.lifecycleId == 1 &&
    <ConfirmationModal />;

  const disabledChat = disableChatInput(currTransaction?.lifecycle ?? { name: "" });

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
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <AddMedia onFileChange={handleFileChange} reset={resetFile} />
            <button
              onClick={sendMessage}
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

