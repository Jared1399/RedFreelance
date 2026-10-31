"use client";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import transactionService from "../transaction.service";
import { ConversationInterface, MessageInterface, LocalMsg, Metadata } from "../types/Chat";
import { TransactionInterface } from "../types/Transaction";

type UseChatReturn = {
  messages: LocalMsg[];
  conversation: ConversationInterface | null;
  selectedFile: File | null;
  setSelectedFile: (f: File | null) => void;
  resetFile: boolean;
  setResetFile: (v: boolean) => void;
  sendMessage: (text?: string, file?: File | null, metadata?: Metadata) => Promise<boolean>;
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  uploadingFile: boolean,
  socketRef: RefObject<Socket | null>
};

async function fetchSocketToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/socket/token");
    if (!res.ok) return null;
    const data = await res.json();
    return data.token ?? null;
  } catch {
    console.error("Failed to fetch socket token");
    return null;
  }
}

export function useChat(
  currTransaction: TransactionInterface | undefined,
  sessionUserId?: string | null
): UseChatReturn {
  const [messages, setMessages] = useState<LocalMsg[]>([]);
  const [conversation, setConversation] = useState<ConversationInterface | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resetFile, setResetFile] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const currentRoomRef = useRef<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ── Socket connection with JWT auth ──
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (!url || !sessionUserId) return;

    let socket: Socket | null = null;

    const connect = async () => {
      const token = await fetchSocketToken();
      if (!token) {
        console.error("No socket token available, skipping connection");
        return;
      }

      socket = io(url, {
        auth: { token },
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      const handleMessage = (msg: { text: string; senderId?: string; metadata?: Metadata }) => {
        const sender: LocalMsg["sender"] = msg.senderId === sessionUserId ? "me" : "other";
        setMessages((prev) => [...prev, { text: msg.text, sender, metadata: msg.metadata }]);
        if (msg.metadata?.type === "delivery") {
          window.document.dispatchEvent(
            new CustomEvent("newDelivery", { detail: { success: true } })
          );
        }
      };

      socket.on("message", handleMessage);
      socketRef.current = socket;
    };

    connect();

    return () => {
      if (currentRoomRef.current && socketRef.current) {
        socketRef.current.emit("leave", currentRoomRef.current);
        currentRoomRef.current = null;
      }
      socket?.off("message");
      socket?.disconnect();
      socketRef.current = null;
    };
  }, [sessionUserId]);

  // ── Join/leave rooms when conversation changes ──
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket?.connected && !socket) return;

    // Leave previous room
    if (currentRoomRef.current) {
      socket?.emit("leave", currentRoomRef.current);
      currentRoomRef.current = null;
    }

    // Join new room
    if (conversation?.id) {
      socket?.emit("join", conversation.id);
      currentRoomRef.current = conversation.id;
    }
  }, [conversation?.id]);

  useEffect(() => {
    let mounted = true;

    const fetchConversation = async () => {
      try {
        const transactionRef = currTransaction;
        if (!transactionRef) return;

        const initialMsg: LocalMsg = {
          text: transactionRef.requestDetails || "",
          sender: transactionRef.clientId === sessionUserId ? "me" : "other",
        };

        setMessages([initialMsg]);

        const convRes = await transactionService.getConversationByTransactionId(transactionRef.id);
        const conv = convRes?.conversation ?? convRes ?? null;

        if (!conv?.id) {
          const body = await transactionService.createConversation(
            transactionRef.clientId,
            transactionRef.freelancerId,
            transactionRef.id
          );

          if (body?.ok) {
            const newConvRes = await transactionService.getConversationByTransactionId(
              transactionRef.id
            );
            const newConv = newConvRes?.conversation ?? newConvRes ?? null;
            if (mounted && newConv?.id) {
              setConversation(newConv);
            }
          }
          return;
        }

        const msgList = conv.messages ?? [];

        const loaded: LocalMsg[] = msgList.map((m: MessageInterface) => {
          return {
            text: m.text,
            sender: m.senderId === sessionUserId ? "me" : "other",
            metadata: m.metadata,
          };
        });

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
  }, [currTransaction, sessionUserId]);

  const sendMessage = useCallback(
    async (text?: string, file?: File | null, metadata?: Metadata) => {
      try {
        const newMsgs: LocalMsg[] = [];

        if (!conversation || !sessionUserId || !currTransaction?.id) return false;
        if (metadata?.type == 'multimedia' && !file) return false;
        if (metadata?.type == 'delivery' && !file) return false;

        const emitMessages = () => {
          if (newMsgs.length > 0) {
            setMessages((prev) => [...prev, ...newMsgs]);
            newMsgs.forEach((msg) => socketRef.current?.emit(
              "message",
              {
                conversationId: conversation.id,
                ...msg,
                senderId: sessionUserId,
                metadata: msg.metadata,
              }
            ));
          }
        };

        if (metadata?.type == 'text') {
          if (text && text.trim()) {
            const t = text.trim();
            await transactionService.sendMessage(conversation.id, t, metadata);
            newMsgs.push({ text: t, sender: "me", metadata });
          }
          emitMessages();
        }

        if (metadata?.type == 'multimedia' && file) {
          setUploadingFile(true);

          const { ok, message } = await transactionService.sendAttachment(
            file,
            conversation.id,
            metadata?.type,
          );

          if (ok && message) {
            newMsgs.push({ ...message, sender: "me", metadata: message.metadata });
            setSelectedFile(null);
            setResetFile(!resetFile);
          }


          if (text && text.trim()) {
            const t = text.trim();
            await transactionService.sendMessage(
              conversation.id,
              t,
              { type: "text" }
            );
            newMsgs.push({ text: t, sender: "me", metadata: { type: "text" } });
          }

          setUploadingFile(false);
          emitMessages();
        }

        if (metadata?.type == 'delivery' && file) {
          setUploadingFile(true);
          const { ok, message } = await transactionService.sendAttachment(
            file,
            conversation.id,
            metadata?.type,
            text ? text.trim() : file.name,
            currTransaction.id
          );

          if (ok && message) {
            newMsgs.push({ ...message, sender: "me", metadata: message.metadata });
          }

          setSelectedFile(null);
          setResetFile(!resetFile);
          setUploadingFile(false);
          emitMessages();

        }

        return true;
      } catch (err) {
        console.error("Error sending message or attachment", err);
        return false;
      }
    },
    [conversation, currTransaction?.id, resetFile, sessionUserId]
  );

  return {
    messages,
    conversation,
    selectedFile,
    setSelectedFile,
    resetFile,
    setResetFile,
    sendMessage,
    messagesContainerRef,
    messagesEndRef,
    uploadingFile,
    socketRef
  };
}
